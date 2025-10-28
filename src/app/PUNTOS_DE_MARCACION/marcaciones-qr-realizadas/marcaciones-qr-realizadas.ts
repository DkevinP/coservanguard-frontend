import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { forkJoin, timer, Subscription, switchMap } from 'rxjs';
import { AsignacionService, Asignacion } from '../../services/asignacion'; 
import { PuestoService, Puesto } from '../../services/puesto';         
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente'; 
import { UsuarioService, Usuario } from '../../services/usuarios';       


// Interfaz para el objeto combinado que mostraremos
export interface MarcacionCombinada {
  sede: string;
  puesto: string;
  usuario: string;
  fecha: string; 
}

@Component({
  selector: 'app-marcacionQrRealizada-interface',
  standalone: false,
  templateUrl: './marcaciones-qr-realizadas.html',
  styleUrls: ['./marcaciones-qr-realizadas.scss']
})

export class marcacionQrRealizadaInterface implements OnInit, OnDestroy {


  public codigoQrDoneDataSource = new MatTableDataSource<MarcacionCombinada>();
  displayedColumns: string[] = ['sede', 'puesto', 'usuario', 'fecha', 'ubicacion'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private asignacionesMap = new Map<number, Asignacion>();
  private puestosMap = new Map<number, Puesto>();
  private sedesMap = new Map<number, SedeCliente>();
  private usuariosMap = new Map<string, Usuario>(); 
  private realTimeSubscription: Subscription | null = null;
  private readonly REFRESH_INTERVAL_MS = 5000; 
  // ------------------------------------------

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    
    private asignacionService: AsignacionService,
    private puestoService: PuestoService,
    private sedeService: SedeClienteService,
    private usuarioService: UsuarioService
    // ---------------------------------
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
  
    forkJoin({
      asignaciones: this.asignacionService.getAsignacion(),
      puestos: this.puestoService.getPuesto(),         
      sedes: this.sedeService.getSedeClientes(),      
      usuarios: this.usuarioService.getUsuarios()       
    }).subscribe({
      next: (referenceData) => {
       
        referenceData.asignaciones.forEach(a => this.asignacionesMap.set(a.id, a));
        referenceData.puestos.forEach(p => this.puestosMap.set(p.id, p));
        referenceData.sedes.forEach(s => this.sedesMap.set(s.id, s));
        referenceData.usuarios.forEach(u => this.usuariosMap.set(u.id, u)); 

    
        this.codigoQrDoneDataSource.paginator = this.paginator;
        this.codigoQrDoneDataSource.sort = this.sort;
        this.setupSorting(); 

      
        this.startPollingMarcaciones();
      },
      error: err => console.error('Error al cargar datos iniciales:', err)
    });
  }

  startPollingMarcaciones(): void {
   
    this.realTimeSubscription = timer(0, this.REFRESH_INTERVAL_MS)
      .pipe(
       
        switchMap(() => this.http.get<any[]>("http://localhost:8080/api/marcacionqr/list-marcacion"))
      )
      .subscribe({
        next: (marcaciones) => {
          
          const combinedData = this.combineMarcacionData(marcaciones);
          this.codigoQrDoneDataSource.data = combinedData;
        },
        error: err => console.error('Error al obtener marcaciones:', err)
       
      });
  }

  combineMarcacionData(marcaciones: any[]): MarcacionCombinada[] {
    return marcaciones.map(marcacion => {
      const asignacion = this.asignacionesMap.get(marcacion.id_asignacion); 
      const puesto = asignacion ? this.puestosMap.get(asignacion.id_puesto) : undefined;
      const sede = puesto ? this.sedesMap.get(puesto.id_sede) : undefined;
      const usuario = asignacion ? this.usuariosMap.get(asignacion.id_user) : undefined; 
      
      
      return {
        sede: sede ? sede.sede : 'Sede Desconocida',
        puesto: puesto ? puesto.puesto : 'Puesto Desconocido',
        usuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario Desconocido',
        fecha: marcacion.fecha, // O formatea la fecha si es necesario // El DTO tiene fecha
        ubicacion: `${marcacion.latitude} , ${marcacion.longitude}`
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
}