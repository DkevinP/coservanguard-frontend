import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearUsuario } from '../form-crear-usuario/form-crear-usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';

// 1. IMPORTAR SERVICIOS
import { CargoService } from '../../services/cargo';
import { UsuarioService, Usuario } from '../../services/usuarios';

@Component({
  selector: 'app-usuario-interface',
  standalone: false,
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})
export class Usuarios implements OnInit, AfterViewInit {

  // 2. TIPADO FUERTE
  public usuarios: Usuario[] = [];
  public usuariosDataSource = new MatTableDataSource<Usuario>();

  // Asegúrate de que estos nombres coincidan con las columnas en tu HTML
  displayedColumns: string[] = ['nombre', 'apellido', 'cedula', 'correo', 'telefono', 'id_cargo'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // 3. INYECTAR SERVICIOS (Adiós HttpClient)
    private cargoService: CargoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 4. USAR SERVICIOS
    const usuarios$ = this.usuarioService.getUsuarios();
    const cargos$ = this.cargoService.getCargo();

    forkJoin({
      usuarios: usuarios$,
      cargos: cargos$
    }).subscribe({
      next: (data) => {
        // Crear mapa de Cargos
        const cargosMap = new Map<number, string>();
        data.cargos.forEach(cargo => {
          cargosMap.set(cargo.id, cargo.nombre_cargo);
        });

        // Cruzar información (Usuario + Nombre de Cargo)
        this.usuarios = data.usuarios.map(usuario => {
          return {
            ...usuario,
            // Buscamos el nombre del cargo usando el ID
            cargoNombre: cargosMap.get(Number(usuario.id_cargo)) || 'Cargo no asignado'
          };
        });

        this.usuariosDataSource.data = this.usuarios;

        // Configurar el ordenamiento personalizado
        this.setupSorting();
      },
      error: (err) => {
        console.error('Error al cargar usuarios y cargos:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.usuariosDataSource.paginator = this.paginator;
    this.usuariosDataSource.sort = this.sort;
    this.setInitialSort();
  }

/**
   * Establece el ordenamiento por defecto de la tabla.
   */
  setInitialSort() {
    // AGREGAMOS ESTE setTimeout
    setTimeout(() => {
      const sortState: Sort = {active: 'id_cargo', direction: 'asc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }); // El tiempo vacío por defecto es 0ms, suficiente para "pasar al siguiente ciclo"
  }

  setupSorting() {
    this.usuariosDataSource.sortingDataAccessor = (item: Usuario, property: string) => {
      switch(property) {
        case 'id_cargo': return item.cargoNombre || ''; // Ordenar por nombre del cargo
        default: return (item as any)[property];
      }
    };
  }

  openCreateusuario(): void {
    const dialogRef = this.dialog.open(FormCrearUsuario, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDatos(); // Recargar datos al crear
      }
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.usuariosDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }
}
