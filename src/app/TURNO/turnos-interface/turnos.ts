import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearTurno } from '../form-crear-turnos/form-crear-turnos';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';

// 1. IMPORTAR SERVICIOS
import { TurnoService, Turno } from './../../services/turnos';
import { UsuarioService, Usuario } from '../../services/usuarios'; // Ajusta la ruta
import { PuestoService, Puesto } from '../../services/puesto';    // Ajusta la ruta

@Component({
  selector: 'app-turnos',
  standalone: false,
  templateUrl: './turnos.html',
  styleUrl: './turnos.scss'
})
export class TurnoInterface implements OnInit, AfterViewInit {

  // Usamos tipado fuerte
  public turnosDataSource = new MatTableDataSource<Turno>();
  displayedColumns: string[] = ['id_cc', 'id_puesto', 'hora_inicio', 'hora_fin'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // 2. INYECTAR SERVICIOS (Adiós HttpClient)
    private turnoService: TurnoService,
    private usuarioService: UsuarioService,
    private puestoService: PuestoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 3. Obtener datos de las 3 fuentes
    const turnos$ = this.turnoService.getTurnos();
    const usuarios$ = this.usuarioService.getUsuarios();
    const puestos$ = this.puestoService.getPuesto();

    // 4. Cruzar información con forkJoin
    forkJoin({
      turnos: turnos$,
      usuarios: usuarios$,
      puestos: puestos$
    }).subscribe({
      next: (data) => {
        // Mapas para búsqueda rápida
        // Nota: Asegúrate si usuario.id es number o string. Aquí asumo number como en Turno.id_cc
        const usuariosMap = new Map<number, string>();
        data.usuarios.forEach(u => {
            // Ajusta aquí si tu usuario usa 'cedula' en vez de 'id' como llave
            usuariosMap.set(Number(u.id), `${u.nombre} ${u.apellido}`);
        });

        const puestosMap = new Map<number, string>();
        data.puestos.forEach(p => puestosMap.set(p.id, p.puesto));

        // Enriquecer los turnos con nombres
        const turnosCompletos = data.turnos.map(turno => {
          return {
            ...turno,
            usuarioNombre: usuariosMap.get(turno.id_cc) || 'Usuario no encontrado',
            puestoNombre: puestosMap.get(turno.id_puesto) || 'Puesto no encontrado'
          };
        });

        this.turnosDataSource.data = turnosCompletos;

        // Configurar ordenamiento
        this.setupSorting();
      },
      error: (err) => {
        console.error('Error al cargar turnos:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.turnosDataSource.paginator = this.paginator;
    this.turnosDataSource.sort = this.sort;
    this.setInitialSort();
  }
  setInitialSort() {
      setTimeout(() => { // <--- AGREGAR ESTO
        const sortState: Sort = {active: 'hora_inicio', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      });
    }

setupSorting() {
    this.turnosDataSource.sortingDataAccessor = (item: Turno, property: string) => {
      switch(property) {
        // Si ordenan por 'id_cc', usamos el nombre para que sea alfabético
        case 'id_cc': return item.usuarioNombre || '';
        // Si ordenan por 'id_puesto', usamos el nombre del puesto
        case 'id_puesto': return item.puestoNombre || '';
        default: return (item as any)[property];
      }
    };
  }

  openCreateTurno(): void {
    const dialogRef = this.dialog.open(FormCrearTurno, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDatos(); // Recargar tabla
      }
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.turnosDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }
}
