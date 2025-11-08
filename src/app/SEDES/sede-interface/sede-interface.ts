import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearSede } from '../form-crear-sede/form-crear-sede';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
//ayuda al uso de lectores de pantalla
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';
import { ClienteService, Cliente } from '../../services/cliente';

@Component({
  selector: 'app-sede-interface',
  standalone: false,
  templateUrl: './sede-interface.html',
  styleUrl: './sede-interface.scss'
})
export class SedeInterface implements OnInit, AfterViewInit{

  public sedes: any;
  public sedesDataSource = new MatTableDataSource<any>(); 
  displayedColumns: string[] = ['sede', 'direccion', 'id_cliente'];

 /**
   * Decorador que permite acceder a un componente del DOM
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private clienteService: ClienteService
  ) {}


ngOnInit(): void {

    const sedes$ = this.http.get<any[]>("http://localhost:8080/api/sede-cliente/list-sede");
    const clientes$ = this.clienteService.getClientes();

    forkJoin({
      sedes: sedes$,
      clientes: clientes$
    }).subscribe({
      next: (data) => {

        const clientesMap = new Map<number, string>();
        data.clientes.forEach((cliente: Cliente) => {
          clientesMap.set(cliente.id, cliente.nombre);
        });

        // 4. Transformamos los datos de las sedes para añadir el nombre del cliente
        this.sedes = data.sedes.map(sede => {
          return {
            ...sede, 
            clienteNombre: clientesMap.get(sede.id_cliente) || 'Cliente no encontrado'
          };
        });


        this.sedesDataSource = new MatTableDataSource(this.sedes);
        this.sedesDataSource.paginator = this.paginator;
        this.sedesDataSource.sort = this.sort;

        // 6. (IMPORTANTE) Le decimos a la tabla cómo ordenar por esa columna
        this.sedesDataSource.sortingDataAccessor = (item: any, property: string) => {
          switch(property) {
            // Cuando el usuario ordene por 'id_cliente', usamos el 'clienteNombre'
            case 'id_cliente': return item.clienteNombre;
            default: return item[property];
          }
        };
      },
      error: err => {
        console.error('Error al cargar datos combinados:', err);
      }
    });
  }
//despues de cargar los datos se ordenan en orden DESC para una lectura mas facil
    ngAfterViewInit() {
    this.sedesDataSource.paginator = this.paginator;
    this.sedesDataSource.sort = this.sort;
  
    this.setInitialSort();
  }

  /**
   * NUEVA FUNCIÓN: Establece el ordenamiento por defecto de la tabla.
   * Ordena por la columna 'id' en modo descendente.
   */
  setInitialSort() {
    // Define el estado de ordenamiento
    // Cambia 'id' por el nombre de tu columna (ej. 'fechaCreacion') si es diferente
    const sortState: Sort = {active: 'id', direction: 'desc'};

    // Aplica el estado al MatSort
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;

    // Notifica a la tabla que el orden ha cambiado
    this.sort.sortChange.emit(sortState);
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


  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      const mensaje = `Ordenado de forma ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`;
      this._liveAnnouncer.announce(mensaje);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }

}
