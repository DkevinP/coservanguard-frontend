import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // 1. Importa AfterViewInit
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCliente } from '../form-crear-cliente/form-crear-cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cliente-interface',
  standalone: false,
  templateUrl: './cliente-interface.html',
  styleUrls: ['./cliente-interface.scss'] 
})
// 2. Implementa AfterViewInit
export class ClienteInterface implements OnInit, AfterViewInit {
  
  public clientes: any;
  // 3. Inicializa el DataSource aquí para evitar errores
  public clientesDataSource = new MatTableDataSource<any>(); 
  displayedColumns: string[] = ['nombre', 'nit', 'telefono', 'email'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  // 4. ngOnInit ahora SOLO carga los datos
  ngOnInit(): void {
    this.http.get("http://localhost:8080/api/cliente/list-cliente").subscribe({
      next: data => {
        this.clientes = data;
        // 5. Asigna la data al DataSource que ya existe
        this.clientesDataSource.data = this.clientes;
        
        // (Quitamos las asignaciones de paginator y sort de aquí, 
        // ya que @ViewChild aún no está listo en ngOnInit)
      },
      error: err => {
        console.log(err);
      }
    });
  }
  
  //Llamar formulario y crear nuevo registro
  openCreateCliente(): void {
    const dialogRef = this.dialog.open(FormCrearCliente, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
      if (result) {
        console.log('Datos recibidos:', result);
        this.ngOnInit(); // Esto recargará los datos
      }
    });
  }
  
  ngAfterViewInit() {
    // Enlaza los componentes a la fuente de datos
    this.clientesDataSource.paginator = this.paginator;
    this.clientesDataSource.sort = this.sort;

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

  //Acciones de la tabla
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