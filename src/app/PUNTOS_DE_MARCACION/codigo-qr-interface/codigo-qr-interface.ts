import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCodigoQr } from '../form-codigo-qr/form-codigo-qr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CodigoQr } from '../codigo-qr/codigo-qr';

import { forkJoin } from 'rxjs';
import { PuestoService, Puesto } from '../../services/puesto';

@Component({
  selector: 'app-codigoQrs',
  standalone: false,
  templateUrl: './codigo-qr-interface.html',
  styleUrl: './codigo-qr-interface.scss'
})

export class CodigoQrInterface implements OnInit, AfterViewInit{
  public codigoQrs: any;
  public codigoQrDataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['puestoNombre', 'ver_qr'];

  /**
   * Decorador que permite acceder a un componente del DOM
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private puestoService: PuestoService
  ) {}

  //Agregar datos a la tabla
ngOnInit(): void {
    // 1. Preparamos ambas peticiones
    const codigoQrs$ = this.http.get<any[]>("http://localhost:8080/api/codigoqr/listar-codigo-img");
    const puestos$ = this.puestoService.getPuesto();

    // 2. Usamos forkJoin
    forkJoin({
      codigoQrs: codigoQrs$,
      puestos: puestos$
    }).subscribe({
      next: (data) => {
        // 3. Creamos un Mapa para buscar puestos por ID
        const puestosMap = new Map<number, string>();
        data.puestos.forEach((puesto: Puesto) => {
          puestosMap.set(puesto.id, puesto.puesto);
        });

        // 4. Transformamos los datos de los QRs
        this.codigoQrs = data.codigoQrs.map(codigoQr => {
          return {
            ...codigoQr, // Datos originales del QR
            puestoNombre: puestosMap.get(codigoQr.id_puesto) || 'Puesto no encontrado'
          };
        });

        // 5. Creamos la fuente de datos
        this.codigoQrDataSource = new MatTableDataSource(this.codigoQrs);
        this.codigoQrDataSource.paginator = this.paginator;
        this.codigoQrDataSource.sort = this.sort;

        // 6. (IMPORTANTE) Añadimos el accesor de ordenamiento
        this.codigoQrDataSource.sortingDataAccessor = (item: any, property: string) => {
          switch(property) {
            case 'id_puesto': return item.puestoNombre; // Ordena por nombre
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
    this.codigoQrDataSource.paginator = this.paginator;
    this.codigoQrDataSource.sort = this.sort;

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
    const dialogRef = this.dialog.open(CodigoQr, { 
      width: '400px',
      data: codigoQr 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo de QR fue cerrado');
      
    });
  }

  //Acciones de la tabla

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.codigoQrDataSource.filter = filtro.trim().toLowerCase();
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
