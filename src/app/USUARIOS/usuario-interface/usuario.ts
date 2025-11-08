import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearUsuario } from '../form-crear-usuario/form-crear-usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { forkJoin } from 'rxjs';
import { CargoService, Cargo } from '../../services/cargo';

@Component({
  selector: 'app-usuario-interface',
  standalone: false,
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})
export class Usuarios implements OnInit, AfterViewInit{

  public usuarios: any;
  public usuariosDataSource: any;
  displayedColumns: string[] = ['nombre', 'apellido', 'cedula', 'correo', 'telefono','id_cargo'];

 /**
   * Decorador que permite acceder a un componente del DOM
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private cargoService: CargoService
  ) {}

  //creacion del dataset
ngOnInit(): void {

    const usuarios$ = this.http.get<any[]>("http://localhost:8080/api/usuario/list-usuario");
    const cargos$ = this.cargoService.getCargo(); 
    forkJoin({
      usuarios: usuarios$,
      cargos: cargos$
    }).subscribe({
      next: (data) => {
       
        const cargosMap = new Map<number, string>();
  
        data.cargos.forEach((cargo: Cargo) => {
          cargosMap.set(cargo.id, cargo.nombre_cargo); 
        });


        this.usuarios = data.usuarios.map(usuario => {
          return {
            ...usuario,
            cargoNombre: cargosMap.get(usuario.id_cargo) || 'Cargo no asignado'
          };
        });


        this.usuariosDataSource = new MatTableDataSource(this.usuarios);
        this.usuariosDataSource.paginator = this.paginator;
        this.usuariosDataSource.sort = this.sort;


        this.usuariosDataSource.sortingDataAccessor = (item: any, property: string) => {
          switch(property) {

            case 'id_cargo': return item.cargoNombre;
            default: return item[property];
          }
        };
      },
      error: err => {
        console.error('Error al cargar datos combinados:', err);
      }
    });
  }

  ngAfterViewInit() {
    // Enlaza los componentes a la fuente de datos
    this.usuariosDataSource.paginator = this.paginator;
    this.usuariosDataSource.sort = this.sort;

    this.setInitialSort();
  }

  /**
   * Establece el ordenamiento por defecto de la tabla.
   * Ordena por la columna 'id' en modo descendente.
   */
  setInitialSort() {
    const sortState: Sort = {active: 'id', direction: 'desc'};

    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;

    this.sort.sortChange.emit(sortState);
  }

  
  //registro de nueva usuario
  openCreateusuario(): void {
    
    const dialogRef = this.dialog.open(FormCrearUsuario, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
      if (result) {
        console.log('Datos recibidos:', result);
        this.ngOnInit();
      }
    });

  }

  //Acciones de la tabla

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.usuariosDataSource.filter = filtro.trim().toLowerCase();
  }


  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      const mensaje = `Ordenado de forma ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`;
      this._liveAnnouncer.announce(mensaje);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }

}
