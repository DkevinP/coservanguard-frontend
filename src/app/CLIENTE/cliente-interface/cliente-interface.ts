import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCliente } from '../form-crear-cliente/form-crear-cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';


@Component({
  selector: 'app-cliente-interface',
  standalone: false,
  templateUrl: './cliente-interface.html',
  styleUrls: ['./cliente-interface.scss'] 
})
export class ClienteInterface implements OnInit{
  public clientes: any;
  public clientesDataSource: any;
  displayedColumns: string[] = ['nombre', 'nit', 'telefono', 'email'];

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

  //Agregar datos a la tabla
  ngOnInit(): void {
    this.http.get("http://localhost:8080/api/cliente/list-cliente").subscribe({
      next: data =>{
        this.clientes = data;
        this.clientesDataSource = new MatTableDataSource(this.clientes);
        this.clientesDataSource.paginator = this.paginator;
        this.clientesDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
  }
  
  //Llamar formulario y crear nuevo registro
  openCreateCliente(): void {
    
    const dialogRef = this.dialog.open(FormCrearCliente, {
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

  ngAfterViewInit() {
    this.clientesDataSource.paginator = this.paginator;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.clientesDataSource.filter = filtro.trim().toLowerCase();
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