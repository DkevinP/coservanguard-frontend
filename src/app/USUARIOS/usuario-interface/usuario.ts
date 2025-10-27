import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearUsuario } from '../form-crear-usuario/form-crear-usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-usuario-interface',
  standalone: false,
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss'
})
export class Usuarios implements OnInit{

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
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  //creacion del dataset
  ngOnInit(): void {
    this.http.get("http://localhost:8080/api/usuario/list-usuario").subscribe({
      next: data =>{
        this.usuarios = data;
        this.usuariosDataSource = new MatTableDataSource(this.usuarios);
        this.usuariosDataSource.paginator = this.paginator;
        this.usuariosDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
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
