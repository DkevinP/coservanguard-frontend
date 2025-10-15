import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearSede } from '../form-crear-sede/form-crear-sede';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-sede-interface',
  standalone: false,
  templateUrl: './sede-interface.html',
  styleUrl: './sede-interface.scss'
})
export class SedeInterface implements OnInit{

  public sedes: any;
  public sedesDataSource: any;
  displayedColumns: string[] = ['sede', 'direccion', 'id_cliente'];

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
    this.http.get("http://localhost:8080/api/sede-cliente/list-sede").subscribe({
      next: data =>{
        this.sedes = data;
        this.sedesDataSource = new MatTableDataSource(this.sedes);
        this.sedesDataSource.paginator = this.paginator;
        this.sedesDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
  }
  
  //registro de nueva sede
  openCreateSede(): void {
    
    const dialogRef = this.dialog.open(FormCrearSede, {
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
    this.sedesDataSource.filter = filtro.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.sedesDataSource.paginator = this.paginator;
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
