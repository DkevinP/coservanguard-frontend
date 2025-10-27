import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCodigoQr } from '../form-codigo-qr/form-codigo-qr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CodigoQr } from '../codigo-qr/codigo-qr';

@Component({
  selector: 'app-codigoQrs',
  standalone: false,
  templateUrl: './codigo-qr-interface.html',
  styleUrl: './codigo-qr-interface.scss'
})

export class CodigoQrInterface implements OnInit{
  public codigoQrs: any;
  public codigoQrsDataSource: any;
  displayedColumns: string[] = ['id_puesto', 'ver_qr'];

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
    this.http.get("http://localhost:8080/api/codigoqr/listar-codigo").subscribe({
      next: data =>{
        this.codigoQrs = data;
        this.codigoQrsDataSource = new MatTableDataSource(this.codigoQrs);
        this.codigoQrsDataSource.paginator = this.paginator;
        this.codigoQrsDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
  }
  
  //Llamar formulario y crear nuevo registro
  openCreatecodigoQr(): void {
    
    const dialogRef = this.dialog.open(FormCrearCodigoQr, {
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

  openQrDialog(codigoQr: any): void {
    const dialogRef = this.dialog.open(CodigoQr, { // Llama al componente CodigoQr
      width: '400px',
      data: codigoQr // Pasa el objeto completo (qr, latitude, etc.) al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo de QR fue cerrado');
      // No es necesario recargar la tabla aquí, solo estamos viendo
    });
  }

  //Acciones de la tabla

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.codigoQrsDataSource.filter = filtro.trim().toLowerCase();
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
