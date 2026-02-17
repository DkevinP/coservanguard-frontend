import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearPuesto } from '../form-puesto/form-puesto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';

// 1. IMPORTAR LOS SERVICIOS
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente';
import { PuestoService, Puesto } from '../../services/puesto';

// Extendemos la interfaz para la vista (tabla)
export interface PuestoConSede extends Puesto {
  sedeNombre?: string;
}

@Component({
  selector: 'app-puestos',
  standalone: false,
  templateUrl: './puesto-interface.html',
  styleUrl: './puesto-interface.scss'
})
export class PuestoInterface implements OnInit, AfterViewInit {

  // Usamos la interfaz extendida
  public puestosDataSource = new MatTableDataSource<PuestoConSede>();
  displayedColumns: string[] = ['puesto', 'id_sede'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // 2. INYECTAR SERVICIOS (Adiós HttpClient)
    private sedeService: SedeClienteService,
    private puestoService: PuestoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 3. Obtener Observables de los servicios
    const puestos$ = this.puestoService.getPuesto();
    const sedes$ = this.sedeService.getSedeClientes();

    // 4. Usar forkJoin para peticiones paralelas
    forkJoin({
      puestos: puestos$,
      sedes: sedes$
    }).subscribe({
      next: (data) => {
        // Crear mapa de Sedes para búsqueda rápida por ID
        const sedesMap = new Map<number, string>();
        data.sedes.forEach((sede) => {
          sedesMap.set(sede.id, sede.sede);
        });

        // Cruzar información: Agregar nombre de sede a cada puesto
        const puestosConNombre: PuestoConSede[] = data.puestos.map(puesto => {
          return {
            ...puesto,
            sedeNombre: sedesMap.get(puesto.id_sede) || 'Sede no encontrada'
          };
        });

        // Asignar a la tabla
        this.puestosDataSource.data = puestosConNombre;

        // Configurar ordenamiento personalizado
        this.setupSorting();
      },
      error: (err) => {
        console.error('Error al cargar puestos y sedes:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.puestosDataSource.paginator = this.paginator;
    this.puestosDataSource.sort = this.sort;
    this.setInitialSort();
  }

  setInitialSort() {
    setTimeout(() => {
      const sortState: Sort = {active: 'id', direction: 'desc'}; // Asumiendo que Puesto tiene 'id'
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    });
  }

  setupSorting() {
    this.puestosDataSource.sortingDataAccessor = (item: PuestoConSede, property: string) => {
      switch(property) {
        case 'id_sede': return item.sedeNombre || ''; // Ordenar por nombre de sede
        default: return (item as any)[property];
      }
    };
  }

  openCreatepuesto(): void {
    const dialogRef = this.dialog.open(FormCrearPuesto, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar datos usando el servicio
        this.cargarDatos();
      }
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.puestosDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }
}
