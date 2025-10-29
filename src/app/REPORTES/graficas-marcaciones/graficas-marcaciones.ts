import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Subscription } from 'rxjs';
import { ChartConfiguration, ChartData, ChartType, ChartOptions, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// Importa TODOS los servicios y sus interfaces
import { ClienteService, Cliente } from '../../services/cliente';
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente';
import { CodigoQrService, MarcacionQrDone } from '../../services/marcacion-qr-done';
import { AsignacionService, Asignacion } from '../../services/asignacion';
import { PuestoService, Puesto } from '../../services/puesto';


@Component({
  selector: 'app-graficas-marcaciones',
  standalone: false,
  templateUrl: './graficas-marcaciones.html',
  styleUrls: ['./graficas-marcaciones.scss']
})
export class GraficasMarcaciones implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  filterForm: FormGroup;

  // Listas de datos
  clientes: Cliente[] = [];
  sedes: SedeCliente[] = [];
  filteredSedes: SedeCliente[] = []; // Sedes filtradas por cliente
  marcaciones: MarcacionQrDone[] = [];
  asignaciones: Asignacion[] = [];
  puestos: Puesto[] = [];

  // Mapas para búsqueda rápida
  private asignacionesMap = new Map<number, Asignacion>(); // Asignacion.id es number
  private puestosMap = new Map<number, Puesto>();       // Puesto.id es number
  private sedesMap = new Map<number, SedeCliente>();    // SedeCliente.id es number

  // --- Propiedades para ng2-charts ---
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public chartLabels: string[] = [];
  public chartType: ChartType = 'bar'; // Tipo inicial (bar o line)
  public chartLegend = true;
  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  // ------------------------------------

  private dataSubscription: Subscription | null = null;
  private formSubscription: Subscription | null = null;

  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private clienteService: ClienteService,
    private sedeService: SedeClienteService,
    private marcacionService: CodigoQrService,
    private asignacionService: AsignacionService,
    private puestoService: PuestoService
  ) {
    this.filterForm = this.fb.group({
      clienteId: [null],
      sedeId: [{ value: null, disabled: true }]
    });
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
  }

  loadInitialData(): void {
    this.isLoading = true;
    console.log("Iniciando carga de datos iniciales...");
    this.dataSubscription = forkJoin({
      clientes: this.clienteService.getClientes(),
      sedes: this.sedeService.getSedeClientes(),
      marcaciones: this.marcacionService.getCodigoQr(),
      asignaciones: this.asignacionService.getAsignacion(),
      puestos: this.puestoService.getPuesto()
    }).subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.sedes = data.sedes;
        this.marcaciones = data.marcaciones;
        this.asignaciones = data.asignaciones;
        this.puestos = data.puestos;

        console.log("Creando mapas...");
        // Asegúrate que los IDs usados como clave sean del tipo correcto
        this.asignaciones.forEach(a => this.asignacionesMap.set(a.id, a)); // Clave: Asignacion.id (number)
        this.puestos.forEach(p => this.puestosMap.set(p.id, p));       // Clave: Puesto.id (number)
        this.sedes.forEach(s => this.sedesMap.set(s.id, s));           // Clave: SedeCliente.id (number)
        console.log(`Mapas creados: ${this.asignacionesMap.size} asignaciones, ${this.puestosMap.size} puestos, ${this.sedesMap.size} sedes.`);

        this.isLoading = false;
        console.log("Datos iniciales cargados con éxito.");
        // Limpiamos el gráfico al inicio
        this.updateChartData([], [], 'bar'); // Muestra un gráfico vacío
      },
      error: (err) => {
        console.error("Error crítico al cargar datos iniciales:", err);
        this.isLoading = false;
      }
    });
  }

  setupFormListeners(): void {
    // Listener para cambios en CUALQUIER control del formulario
    this.formSubscription = this.filterForm.valueChanges.subscribe(values => {
      console.log("Cambio en formulario detectado:", values);
      this.generateChartData(); // Llama a la función que prepara y actualiza los datos del gráfico
    });

    // Listener específico para el CLIENTE
    this.filterForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      console.log(`Cambio de Cliente ID a: ${clienteId}`);
      this.onClientChange(clienteId);
      const sedeControl = this.filterForm.get('sedeId');
      if (clienteId) {
        sedeControl?.enable({ emitEvent: false });
      } else {
        sedeControl?.disable({ emitEvent: false });
        sedeControl?.setValue(null, { emitEvent: false });
        this.filteredSedes = [];
      }
      // No llamamos a generateChartData aquí, lo hace el listener general
    });
  }

  onClientChange(clienteId: number | null): void {
    if (clienteId) {
      console.log(`Filtrando sedes para Cliente ID: ${clienteId}`);
      this.filteredSedes = this.sedes.filter(sede => sede.id_cliente === clienteId);
      console.log(`Sedes filtradas encontradas: ${this.filteredSedes.length}`, this.filteredSedes);
    } else {
      this.filteredSedes = [];
    }
    this.filterForm.get('sedeId')?.setValue(null, { emitEvent: false });
  }

  generateChartData(): void {
    if (this.isLoading) {
        console.log("generateChartData: Saltando, datos aún cargando.");
        return;
    }

    const selectedClientId = this.filterForm.value.clienteId;
    const selectedSedeId = this.filterForm.value.sedeId;

    console.log(`Generando datos para Cliente ID: ${selectedClientId}, Sede ID: ${selectedSedeId}`);

    if (!selectedClientId) {
      this.updateChartData([], [], 'bar'); // Gráfico vacío
      console.log("Datos de gráfico limpiados (sin cliente seleccionado).");
      return;
    }

    // --- LÓGICA DE FILTRADO Y AGRUPACIÓN ---
    console.log("Iniciando filtrado de marcaciones...");
    const filteredMarcaciones = this.marcaciones.filter(m => {
      // Verifica tipos y enlaza: Marcacion -> Asignacion -> Puesto -> Sede
      const asignacionId = parseInt(m.id_asignacion, 10);
      if (isNaN(asignacionId)) return false;
      const asignacion = this.asignacionesMap.get(asignacionId);
      if (!asignacion) return false;
      const puesto = this.puestosMap.get(asignacion.id_puesto);
      if (!puesto) return false;
      const sede = this.sedesMap.get(puesto.id_sede);
      if (!sede) return false;

      // Aplicar filtros
      if (selectedSedeId) { // Filtro por sede específica
        return sede.id === selectedSedeId && sede.id_cliente === selectedClientId;
      } else { // Filtro solo por cliente
        return sede.id_cliente === selectedClientId;
      }
    });
    console.log(`Marcaciones filtradas encontradas: ${filteredMarcaciones.length}`);

    // --- PREPARACIÓN DE DATOS PARA EL GRÁFICO ---
    let newLabels: string[] = [];
    let newData: number[] = [];
    let newChartType: ChartType = 'bar';
    let newLabel = '';

    if (selectedSedeId) {
      // --- GRÁFICO DE LÍNEA (POR TIEMPO) ---
      newChartType = 'line';
      const marcacionesPorFecha = new Map<string, number>();
      console.log("Agrupando para gráfico de línea...");

      filteredMarcaciones.forEach(m => {
        try {
            const fecha = new Date(m.fecha);
            if (!isNaN(fecha.getTime())) {
                const fechaStr = fecha.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
                marcacionesPorFecha.set(fechaStr, (marcacionesPorFecha.get(fechaStr) || 0) + 1);
            }
        } catch (e) { console.warn("Error al procesar fecha:", m.fecha, e); }
      });

      // Ordena las fechas (DD/MM/YYYY -> YYYYMMDD para ordenar)
      newLabels = Array.from(marcacionesPorFecha.keys()).sort((a, b) => {
          const dateA = a.split('/').reverse().join('');
          const dateB = b.split('/').reverse().join('');
          return dateA.localeCompare(dateB);
      });
      newData = newLabels.map(date => marcacionesPorFecha.get(date) || 0);
      newLabel = `Marcaciones - Sede: ${this.sedesMap.get(selectedSedeId)?.sede || selectedSedeId}`;
      console.log(`Fechas ordenadas para eje X: ${newLabels.length}`);

    } else {
      // --- GRÁFICO DE BARRAS (POR SEDE) ---
      newChartType = 'bar';
      const marcacionesPorSede = new Map<number, number>(); // Map<sedeId, count>
      console.log("Agrupando para gráfico de barras...");

      filteredMarcaciones.forEach(m => {
        const asignacionId = parseInt(m.id_asignacion, 10);
        if (isNaN(asignacionId)) return;
        const asignacion = this.asignacionesMap.get(asignacionId);
        const puesto = asignacion ? this.puestosMap.get(asignacion.id_puesto) : undefined;
        const sede = puesto ? this.sedesMap.get(puesto.id_sede) : undefined;
        if (sede) {
          marcacionesPorSede.set(sede.id, (marcacionesPorSede.get(sede.id) || 0) + 1);
        }
      });

      // Usa filteredSedes para las etiquetas y el orden
      this.filteredSedes.forEach(sede => {
          newLabels.push(sede.sede);
          newData.push(marcacionesPorSede.get(sede.id) || 0);
      });
      newLabel = `Marcaciones por Sede - Cliente: ${this.clientes.find(c => c.id === selectedClientId)?.nombre || selectedClientId}`;
      console.log(`Sedes para eje X: ${newLabels.length}`);
    }

    // Actualiza las propiedades del componente que están vinculadas al gráfico
    this.updateChartData(newLabels, newData, newChartType, newLabel);
  }

  // Función auxiliar para actualizar los datos del gráfico de forma segura
  updateChartData(labels: string[], data: number[], type: ChartType, label: string = 'Datos'): void {
      this.chartType = type;
      this.chartLabels = labels;
      this.chartData = {
        labels: this.chartLabels,
        datasets: [{
          data: data,
          label: label,
          // Colores según el tipo de gráfico
          backgroundColor: type === 'bar' ? '#2E3A4B' : 'rgba(200, 56, 50, 0.2)', // Azul para barras, Rojo tenue para línea
          borderColor: type === 'line' ? '#C83832' : undefined, // Borde Rojo para línea
          fill: type === 'line' ? true : undefined,
          tension: type === 'line' ? 0.1 : undefined
        }]
      };
      // Forzamos la actualización si es necesario (aunque ng2-charts suele detectarlo)
      // this.chart?.update();
      console.log("Propiedades del gráfico actualizadas:", { type: this.chartType, labels: this.chartLabels.length, data: data.length });
  }


  downloadChart(): void {
    if (this.chart?.chart) {
      const canvas = this.chart.chart.canvas;
      // Fondo blanco para la descarga (opcional)
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#ffffff'; // Fondo blanco
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const imageURL = canvas.toDataURL('image/png', 1.0);

      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'grafico_marcaciones.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Descarga de gráfico iniciada.");
      // Restaurar composición (opcional, si afecta al gráfico visible)
      // if(ctx) ctx.globalCompositeOperation = 'source-over';
    } else {
      console.error("No se puede descargar, el gráfico no está listo.");
    }
  }
}