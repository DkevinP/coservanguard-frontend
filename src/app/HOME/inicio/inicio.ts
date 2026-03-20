import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Importamos los servicios necesarios para el cálculo
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente';
import { PuestoService, Puesto } from '../../services/puesto';
import { AsignacionService, Asignacion } from '../../services/asignacion';
import { MarcacionQrDoneService } from '../../services/marcacion-qr-done';

// Interfaz para la tabla del Top 5
export interface TopSede {
  posicion: number;
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class InicioComponent implements OnInit {

  public isLoading = true;
  public topSedes: TopSede[] = [];
  public displayedColumns: string[] = ['posicion', 'nombre', 'cantidad'];

  // Mapas de memoria para cruce rápido
  private asignacionesMap = new Map<number, Asignacion>();
  private puestosMap = new Map<number, Puesto>();
  private sedesMap = new Map<number, SedeCliente>();

  constructor(
    private router: Router,
    private sedeService: SedeClienteService,
    private puestoService: PuestoService,
    private asignacionService: AsignacionService,
    private marcacionService: MarcacionQrDoneService
  ) {}

  ngOnInit(): void {
    this.cargarDatosYCalcularTop();
  }

  // Función para navegar desde las tarjetas
  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cargarDatosYCalcularTop(): void {
    this.isLoading = true;

    forkJoin({
      sedes: this.sedeService.getSedeClientes(),
      puestos: this.puestoService.getPuesto(),
      asignaciones: this.asignacionService.getAsignacion(),
      marcaciones: this.marcacionService.getMarcaciones()
    }).subscribe({
      next: (data) => {
        // 1. Llenamos los mapas para búsqueda rápida
        data.sedes.forEach(s => this.sedesMap.set(s.id, s));
        data.puestos.forEach(p => this.puestosMap.set(p.id, p));
        data.asignaciones.forEach(a => this.asignacionesMap.set(a.id, a));

        // 2. Contamos las marcaciones por Sede
        const conteoPorSede = new Map<number, number>();

        data.marcaciones.forEach(m => {
          const asignacion = this.asignacionesMap.get(m.id_asignacion);
          const puesto = asignacion ? this.puestosMap.get(asignacion.id_puesto) : undefined;
          const sede = puesto ? this.sedesMap.get(puesto.id_sede) : undefined;

          if (sede) {
            conteoPorSede.set(sede.id, (conteoPorSede.get(sede.id) || 0) + 1);
          }
        });

        // 3. Transformamos a un arreglo, ordenamos de mayor a menor y tomamos las 5 primeras
        const sedesArray = Array.from(conteoPorSede.entries()).map(([sedeId, cantidad]) => {
          return {
            nombre: this.sedesMap.get(sedeId)?.sede || 'Sede Desconocida',
            cantidad: cantidad
          };
        });

        sedesArray.sort((a, b) => b.cantidad - a.cantidad);

        this.topSedes = sedesArray.slice(0, 5).map((item, index) => ({
          posicion: index + 1,
          nombre: item.nombre,
          cantidad: item.cantidad
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard:', err);
        this.isLoading = false;
      }
    });
  }
}
