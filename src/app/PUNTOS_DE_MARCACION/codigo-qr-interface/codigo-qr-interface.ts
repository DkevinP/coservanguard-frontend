import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearCodigoQr } from '../form-codigo-qr/form-codigo-qr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CodigoQr } from '../codigo-qr/codigo-qr'; // Componente Dialog para ver el QR
import { forkJoin } from 'rxjs';

// --- IMPORTS DE SERVICIOS ---
import { PuestoService, Puesto } from '../../services/puesto';
import { CodigoQrService, CodigoQR } from '../../services/codigosqr'; // Ajusta la ruta

@Component({
  selector: 'app-codigoQrs',
  standalone: false,
  templateUrl: './codigo-qr-interface.html',
  styleUrl: './codigo-qr-interface.scss'
})
export class CodigoQrInterface implements OnInit, AfterViewInit {

  // Usamos tipado fuerte (CodigoQR[])
  public codigoQrs: CodigoQR[] = [];
  public codigoQrDataSource = new MatTableDataSource<CodigoQR>();
  displayedColumns: string[] = ['puestoNombre', 'ver_qr'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // INYECTAMOS SERVICIOS (Adiós HttpClient)
    private puestoService: PuestoService,
    private codigoQrService: CodigoQrService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Llamamos a los servicios
    const codigoQrs$ = this.codigoQrService.getCodigoQr();
    const puestos$ = this.puestoService.getPuesto();

    // 2. forkJoin para ejecutar en paralelo
    forkJoin({
      codigoQrs: codigoQrs$,
      puestos: puestos$
    }).subscribe({
      next: (data) => {
        // 3. Mapa de puestos para búsqueda rápida
        const puestosMap = new Map<number, string>();
        data.puestos.forEach((puesto: Puesto) => {
          puestosMap.set(puesto.id, puesto.puesto);
        });

        // 4. Cruzamos la información
        this.codigoQrs = data.codigoQrs.map(codigoQr => {
          return {
            ...codigoQr,
            // Obtenemos el nombre del puesto usando el ID
            puestoNombre: puestosMap.get(codigoQr.id_puesto) || 'Puesto no encontrado'
          };
        });

        // 5. Asignamos a la tabla
        this.codigoQrDataSource.data = this.codigoQrs;

        // Configuración de ordenamiento
        this.setupSorting();
      },
      error: (err) => {
        console.error('Error al cargar datos de códigos QR:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.codigoQrDataSource.paginator = this.paginator;
    this.codigoQrDataSource.sort = this.sort;
    this.setInitialSort();
  }

  setInitialSort() {
    setTimeout(() => {
      const sortState: Sort = {active: 'id', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    });
  }

  setupSorting() {
    this.codigoQrDataSource.sortingDataAccessor = (item: any, property: string) => {
      switch(property) {
        case 'puestoNombre': return item.puestoNombre;
        default: return item[property];
      }
    };
  }

  openCreatecodigoQr(): void {
    const dialogRef = this.dialog.open(FormCrearCodigoQr, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargamos usando el servicio centralizado
        this.cargarDatos();
      }
    });
  }

  openQrDialog(codigoQr: any): void {
    this.dialog.open(CodigoQr, {
      width: '400px',
      data: codigoQr
    });
  }

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
