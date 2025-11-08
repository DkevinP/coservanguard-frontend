import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCargo } from '../form-crear-cargo/form-crear-cargo';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';


@Component({
  selector: 'app-cargo-interface',
  standalone: false,
  templateUrl: './cargo-interface.html',
  styleUrls: ['./cargo-interface.scss'] 
})
export class CargoInterface implements OnInit, AfterViewInit{
  public cargos: any;
  public cargosDataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['nombre_cargo'];

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
    this.http.get("http://localhost:8080/api/cargo/list-cargo").subscribe({
      next: data =>{
        this.cargos = data;
        this.cargosDataSource = new MatTableDataSource(this.cargos);
        this.cargosDataSource.paginator = this.paginator;
        this.cargosDataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
      
    });
  }
  
  //Llamar formulario y crear nuevo registro
  openCreatecargo(): void {
    
    const dialogRef = this.dialog.open(FormCrearCargo, {
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
    // Enlaza los componentes a la fuente de datos
    this.cargosDataSource.paginator = this.paginator;
    this.cargosDataSource.sort = this.sort;

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

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.cargosDataSource.filter = filtro.trim().toLowerCase();
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