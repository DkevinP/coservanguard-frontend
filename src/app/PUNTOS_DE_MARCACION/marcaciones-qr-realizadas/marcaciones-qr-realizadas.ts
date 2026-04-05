import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { forkJoin, timer, Subscription, switchMap } from 'rxjs';

// --- SERVICIOS ---
import { AsignacionService, Asignacion } from '../../services/asignacion';
import { PuestoService, Puesto } from '../../services/puesto';
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente';
import { UsuarioService, Usuario } from '../../services/usuarios';
import { MarcacionQrDoneService, MarcacionQrDone } from '../../services/marcacion-qr-done';
import { MarcacionDetalleDialogComponent } from '../marcacion-detalle/marcacion-detalle';

// Interfaz para la tabla
export interface MarcacionCombinada {
  sede: string;
  puesto: string;
  usuario: string;
  fecha: string | Date; // Permitimos Date para facilitar el ordenamiento
  ubicacion: string;    // Agregamos ubicación que faltaba en la interfaz
}

@Component({
  selector: 'app-marcacionQrRealizada-interface',
  standalone: false,
  templateUrl: './marcaciones-qr-realizadas.html',
  styleUrls: ['./marcaciones-qr-realizadas.scss']
})
export class marcacionQrRealizadaInterface implements OnInit, OnDestroy {

  public codigoQrDoneDataSource = new MatTableDataSource<MarcacionCombinada>();
  displayedColumns: string[] = ['sede', 'puesto', 'usuario', 'fecha', 'ubicacion', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Mapas para cruzar información
  private asignacionesMap = new Map<number, Asignacion>();
  private puestosMap = new Map<number, Puesto>();
  private sedesMap = new Map<number, SedeCliente>();
  private usuariosMap = new Map<string, Usuario>();

  private realTimeSubscription: Subscription | null = null;
  private readonly REFRESH_INTERVAL_MS = 5000;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // Inyectamos los servicios (Adiós HttpClient)
    private asignacionService: AsignacionService,
    private puestoService: PuestoService,
    private sedeService: SedeClienteService,
    private usuarioService: UsuarioService,
    private marcacionService: MarcacionQrDoneService
  ) {}

  ngOnInit(): void {
    this.loadInitialDataAndStartPolling();
  }

  ngOnDestroy(): void {
    if (this.realTimeSubscription) {
      this.realTimeSubscription.unsubscribe();
    }
  }

  loadInitialDataAndStartPolling(): void {
    // 1. Cargamos los datos de referencia (Catálogos)
    forkJoin({
      asignaciones: this.asignacionService.getAsignacion(),
      puestos: this.puestoService.getPuesto(),
      sedes: this.sedeService.getSedeClientes(),
      usuarios: this.usuarioService.getUsuarios()
    }).subscribe({
      next: (referenceData) => {
        // Llenamos los mapas
        referenceData.asignaciones.forEach(a => this.asignacionesMap.set(a.id, a));
        referenceData.puestos.forEach(p => this.puestosMap.set(p.id, p));
        referenceData.sedes.forEach(s => this.sedesMap.set(s.id, s));
        referenceData.usuarios.forEach(u => this.usuariosMap.set(u.id, u));

        this.codigoQrDoneDataSource.paginator = this.paginator;
        this.codigoQrDoneDataSource.sort = this.sort;
        this.setupSorting();

        // 2. Iniciamos el polling de marcaciones
        this.startPollingMarcaciones();
      },
      error: err => console.error('Error al cargar datos iniciales:', err)
    });
  }

  startPollingMarcaciones(): void {
    // Usamos el servicio dentro del switchMap
    this.realTimeSubscription = timer(0, this.REFRESH_INTERVAL_MS)
      .pipe(
        switchMap(() => this.marcacionService.getMarcaciones())
      )
      .subscribe({
        next: (marcaciones) => {
          const combinedData = this.combineMarcacionData(marcaciones);
          this.codigoQrDoneDataSource.data = combinedData;
        },
        error: err => console.error('Error al obtener marcaciones:', err)
      });
  }

  combineMarcacionData(marcaciones: MarcacionQrDone[]): MarcacionCombinada[] {
    return marcaciones.map(marcacion => {
      // Lógica de cruce de datos
      const asignacion = this.asignacionesMap.get(marcacion.id_asignacion);

      // Obtenemos relaciones en cadena: Asignacion -> Puesto -> Sede
      const puesto = asignacion ? this.puestosMap.get(asignacion.id_puesto) : undefined;
      const sede = puesto ? this.sedesMap.get(puesto.id_sede) : undefined;
      const usuario = asignacion ? this.usuariosMap.get(asignacion.id_user) : undefined;

      return {
        sede: sede ? sede.sede : 'Sede Desconocida',
        puesto: puesto ? puesto.puesto : 'Puesto Desconocido',
        usuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario Desconocido',
        fecha: marcacion.fecha.toString(), // Convertimos a string o mantenemos Date según prefieras visualizarlos
        ubicacion: `${marcacion.latitude}, ${marcacion.longitude}`
      };
    });
  }

  setupSorting(): void {
    this.codigoQrDoneDataSource.sortingDataAccessor = (item: MarcacionCombinada, property: string) => {
      switch(property) {
        case 'sede': return item.sede;
        case 'puesto': return item.puesto;
        case 'usuario': return item.usuario;
        case 'fecha': return new Date(item.fecha).getTime();
        default: return (item as any)[property];
      }
    };
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.codigoQrDoneDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }

  abrirDetalle(marcacion: MarcacionCombinada): void {
    this.dialog.open(MarcacionDetalleDialogComponent, {
      width: '850px', // Un buen tamaño para que el mapa y el texto se vean bien
      data: marcacion // Pasamos la fila seleccionada
    });
  }



}
