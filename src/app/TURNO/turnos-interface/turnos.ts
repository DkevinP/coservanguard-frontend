import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearTurno } from '../form-crear-turnos/form-crear-turnos';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-turnos',
  standalone: false,
  templateUrl: './turnos.html',
  styleUrl: './turnos.scss'
})

export class TurnoInterface implements OnInit{
  public turnos: any;
  public turnosDataSource: any;
  displayedColumns: string[] = ['id_cc', 'id_puesto', 'hora_inicio', 'hora_fin'];

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
    this.http.get("http://localhost:8080/api/turno/list-turno").subscribe({
      next: data =>{
        this.turnos = data;
        this.turnosDataSource = new MatTableDataSource(this.turnos);
        this.turnosDataSource.paginator = this.paginator;
        this.turnosDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
  }
  
  //Llamar formulario y crear nuevo registro
  openCreateTurno(): void {
    
    const dialogRef = this.dialog.open(FormCrearTurno, {
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
    this.turnosDataSource.paginator = this.paginator;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.turnosDataSource.filter = filtro.trim().toLowerCase();
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
