import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCliente } from '../form-crear-cliente/form-crear-cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// 1. IMPORTAMOS EL SERVICIO Y LA INTERFAZ (Ya no HttpClient)
import { ClienteService, Cliente } from './../../services/cliente';

@Component({
  selector: 'app-cliente-interface',
  standalone: false,
  templateUrl: './cliente-interface.html',
  styleUrls: ['./cliente-interface.scss']
})
export class ClienteInterface implements OnInit, AfterViewInit {

  // Usamos la interfaz 'Cliente' para tipado fuerte en lugar de 'any'
  public clientes: Cliente[] = [];
  public clientesDataSource = new MatTableDataSource<Cliente>();

  displayedColumns: string[] = ['nombre', 'nit', 'telefono', 'email'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    // 2. INYECTAMOS EL SERVICIO (Quitamos private http: HttpClient)
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // Creamos un método auxiliar para cargar datos (más limpio)
  cargarClientes() {
    // 3. USAMOS EL SERVICIO
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesDataSource.data = this.clientes;
        // Nota: No necesitas reasignar paginator/sort aquí si ya están en ngAfterViewInit
      },
      error: (err) => {
        console.error('Error al consultar clientes:', err);
      }
    });
  }

  openCreateCliente(): void {
    const dialogRef = this.dialog.open(FormCrearCliente, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
      if (result) {
        // Al cerrar el diálogo y crear, recargamos la lista
        this.cargarClientes();
      }
    });
  }

  ngAfterViewInit() {
    this.clientesDataSource.paginator = this.paginator;
    this.clientesDataSource.sort = this.sort;
    this.setInitialSort();
  }

  setInitialSort() {
    const sortState: Sort = {active: 'id', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
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
