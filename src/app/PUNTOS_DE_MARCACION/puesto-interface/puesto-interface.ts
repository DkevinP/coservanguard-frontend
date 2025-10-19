import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearPuesto } from '../form-puesto/form-puesto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-puestos',
  standalone: false,
  templateUrl: './puesto-interface.html',
  styleUrl: './puesto-interface.scss'
})

export class PuestoInterface implements OnInit{
  public puestos: any;
  public puestosDataSource: any;
  displayedColumns: string[] = ['puesto', 'id_sede'];

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
    this.http.get("http://localhost:8080/api/puesto/list-puesto").subscribe({
      next: data =>{
        this.puestos = data;
        this.puestosDataSource = new MatTableDataSource(this.puestos);
        this.puestosDataSource.paginator = this.paginator;
        this.puestosDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
  }
  
  //Llamar formulario y crear nuevo registro
  openCreatepuesto(): void {
    
    const dialogRef = this.dialog.open(FormCrearPuesto, {
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
    this.puestosDataSource.paginator = this.paginator;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.puestosDataSource.filter = filtro.trim().toLowerCase();
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
