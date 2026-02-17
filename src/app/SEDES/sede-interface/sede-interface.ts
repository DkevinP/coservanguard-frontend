import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearSede } from '../form-crear-sede/form-crear-sede';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';

// 1. IMPORTAR SERVICIOS (Ajusta la ruta si es necesario)
import { ClienteService } from '../../services/cliente';
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente';

@Component({
  selector: 'app-sede-interface',
  standalone: false,
  templateUrl: './sede-interface.html',
  styleUrl: './sede-interface.scss'
})
export class SedeInterface implements OnInit, AfterViewInit {

  // Tipado fuerte con la interfaz
  public sedes: SedeCliente[] = [];
  public sedesDataSource = new MatTableDataSource<SedeCliente>();
  displayedColumns: string[] = ['sede', 'direccion', 'id_cliente'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    // 2. INYECTAR EL NUEVO SERVICIO (Quitamos HttpClient)
    private sedeService: SedeClienteService,
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 3. USAR LOS SERVICIOS EN LUGAR DE HTTP DIRECTO
    const sedes$ = this.sedeService.getSedeClientes();
    const clientes$ = this.clienteService.getClientes();

    // forkJoin espera a que ambas peticiones terminen
    forkJoin({
      sedes: sedes$,
      clientes: clientes$
    }).subscribe({
      next: (data) => {
        // Creamos un mapa para búsqueda rápida de nombres de clientes
        const clientesMap = new Map<number, string>();
        data.clientes.forEach(cliente => {
          clientesMap.set(cliente.id, cliente.nombre);
        });

        // Cruzamos la información: A cada sede le ponemos el nombre de su cliente
        this.sedes = data.sedes.map(sede => {
          return {
            ...sede,
            clienteNombre: clientesMap.get(sede.id_cliente) || 'Cliente no encontrado'
          };
        });

        // Asignamos a la tabla
        this.sedesDataSource.data = this.sedes;

        // Configuramos el ordenamiento personalizado para la columna de cliente
        this.sedesDataSource.sortingDataAccessor = (item: any, property: string) => {
          switch(property) {
            case 'id_cliente': return item.clienteNombre; // Ordenar por nombre, no por ID
            default: return item[property];
          }
        };
      },
      error: (err) => {
        console.error('Error al cargar datos combinados:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.sedesDataSource.paginator = this.paginator;
    this.sedesDataSource.sort = this.sort;
    this.setInitialSort();
  }

  setInitialSort() {
    const sortState: Sort = {active: 'id', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  openCreateSede(): void {
    const dialogRef = this.dialog.open(FormCrearSede, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDatos(); // Recargar tabla al crear
      }
    });
  }

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
