import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearAsignacion } from '../form-asignacion/form-asignacion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';

// --- IMPORTAMOS LOS SERVICIOS ---
// Ajusta las rutas según tu estructura de carpetas real
import { UsuarioService, Usuario } from '../../services/usuarios';
import { PuestoService, Puesto } from '../../services/puesto';
import { AsignacionService, Asignacion } from '../../services/asignacion';

// Interfaz extendida para mostrar nombres en la tabla
export interface AsignacionCombinada extends Asignacion {
  usuarioNombreCompleto?: string;
  puestoNombre?: string;
}

@Component({
  selector: 'app-asignacion',
  standalone: false,
  templateUrl: './asignacion-interface.html',
  styleUrl: './asignacion-interface.scss'
})
export class asignacionInterface implements OnInit, AfterViewInit {

  public asignacionCombinadaDataSource = new MatTableDataSource<AsignacionCombinada>();
  displayedColumns: string[] = ['usuario', 'puesto'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Mapas para búsqueda rápida
  private usuariosMap = new Map<string, Usuario>();
  private puestosMap = new Map<number, Puesto>();

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // INYECTAMOS LOS 3 SERVICIOS (Ya no HttpClient)
    private usuarioService: UsuarioService,
    private puestoService: PuestoService,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Usamos los servicios para obtener los Observables
    const asignaciones$ = this.asignacionService.getAsignacion();
    const usuarios$ = this.usuarioService.getUsuarios();
    const puestos$ = this.puestoService.getPuesto();

    // 2. forkJoin ejecuta las 3 peticiones en paralelo y espera a que terminen
    forkJoin({
      asignaciones: asignaciones$,
      usuarios: usuarios$,
      puestos: puestos$
    }).subscribe({
      next: (data) => {
        // 3. Llenamos los mapas para cruzar información eficientemente
        // Nota: Asegúrate de que los tipos de ID (string/number) coincidan
        data.usuarios.forEach(u => this.usuariosMap.set(String(u.id), u));
        data.puestos.forEach(p => this.puestosMap.set(p.id, p));

        // 4. Cruzamos la información (Asignación + Usuario + Puesto)
        const combinedData: AsignacionCombinada[] = data.asignaciones.map(asignacion => {
          const usuario = this.usuariosMap.get(String(asignacion.id_user));
          const puesto = this.puestosMap.get(asignacion.id_puesto);

          return {
            ...asignacion,
            usuarioNombreCompleto: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado',
            puestoNombre: puesto ? puesto.puesto : 'Puesto no encontrado'
          };
        });

        // 5. Asignamos a la tabla
        this.asignacionCombinadaDataSource.data = combinedData;

        // Configuramos filtros y ordenamiento custom
        this.setupSorting();
      },
      error: err => {
        console.error('Error al cargar asignaciones:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.asignacionCombinadaDataSource.paginator = this.paginator;
    this.asignacionCombinadaDataSource.sort = this.sort;
    this.setInitialSort();
  }

  setInitialSort() {
    const sortState: Sort = {active: 'id', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  setupSorting(): void {
    this.asignacionCombinadaDataSource.sortingDataAccessor = (item: AsignacionCombinada, property: string) => {
      switch(property) {
        case 'usuario': return item.usuarioNombreCompleto || '';
        case 'puesto': return item.puestoNombre || '';
        default: return (item as any)[property];
      }
    };
  }

  openCreateAsignacion(): void {
    const dialogRef = this.dialog.open(FormCrearAsignacion, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDatos(); // Recargamos usando el servicio
      }
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.asignacionCombinadaDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }
}
