import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearPuesto } from '../form-puesto/form-puesto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { forkJoin } from 'rxjs';
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente'; // Ajusta la ruta si es necesario

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
    private _liveAnnouncer: LiveAnnouncer,
    private sedeService: SedeClienteService
  ) {}

  //Agregar datos a la tabla
  ngOnInit(): void {
   
    const puestos$ = this.http.get<any[]>("http://localhost:8080/api/puesto/list-puesto");
    const sedes$ = this.sedeService.getSedeClientes();


    forkJoin({
      puestos: puestos$,
      sedes: sedes$
    }).subscribe({
      next: (data) => {
    
        const sedesMap = new Map<number, string>();
        data.sedes.forEach((sede: SedeCliente) => {
          sedesMap.set(sede.id, sede.sede);
        });

        
        this.puestos = data.puestos.map(puesto => {
          return {
            ...puesto, 
            sedeNombre: sedesMap.get(puesto.id_sede) || 'Sede no encontrada'
          };
        });


        this.puestosDataSource = new MatTableDataSource(this.puestos);
        this.puestosDataSource.paginator = this.paginator;
        this.puestosDataSource.sort = this.sort;


        this.puestosDataSource.sortingDataAccessor = (item: any, property: string) => {
          switch(property) {
            case 'id_sede': return item.sedeNombre; 
            default: return item[property];
          }
        };
      },
      error: err => {
        console.error('Error al cargar datos combinados:', err);
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
