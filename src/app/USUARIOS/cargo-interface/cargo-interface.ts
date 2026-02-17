import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCargo } from '../form-crear-cargo/form-crear-cargo';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// 1. IMPORTAR SERVICIO E INTERFAZ
import { CargoService, Cargo } from '../../services/cargo';

@Component({
  selector: 'app-cargo-interface',
  standalone: false,
  templateUrl: './cargo-interface.html',
  styleUrls: ['./cargo-interface.scss']
})
export class CargoInterface implements OnInit, AfterViewInit {

  // 2. TIPADO FUERTE
  public cargos: Cargo[] = [];
  public cargosDataSource = new MatTableDataSource<Cargo>();
  displayedColumns: string[] = ['nombre_cargo'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // 3. INYECTAR SERVICIO (Adiós HttpClient)
    private cargoService: CargoService
  ) {}

  ngOnInit(): void {
    this.cargarCargos();
  }

  cargarCargos() {
    this.cargoService.getCargo().subscribe({
      next: (data) => {
        this.cargos = data;
        this.cargosDataSource.data = this.cargos;
        // Nota: Paginator y Sort se vinculan en ngAfterViewInit
      },
      error: (err) => {
        console.error('Error al cargar cargos:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.cargosDataSource.paginator = this.paginator;
    this.cargosDataSource.sort = this.sort;
    this.setInitialSort();
  }

/**
   * Establece el ordenamiento por defecto de la tabla.
   * Ordena por la columna 'id' en modo descendente.
   */
  setInitialSort() {
    // AGREGAMOS ESTE setTimeout
    setTimeout(() => {
      const sortState: Sort = {active: 'id', direction: 'desc'};

      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;

      this.sort.sortChange.emit(sortState);
    });
  }

  openCreatecargo(): void {
    const dialogRef = this.dialog.open(FormCrearCargo, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar datos usando el servicio
        this.cargarCargos();
      }
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.cargosDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }
}
