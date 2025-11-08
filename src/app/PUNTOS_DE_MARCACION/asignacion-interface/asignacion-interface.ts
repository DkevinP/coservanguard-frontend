import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCrearAsignacion } from '../form-asignacion/form-asignacion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// --- NUEVOS IMPORTS ---
import { forkJoin } from 'rxjs';
import { UsuarioService, Usuario } from '../../services/usuarios'; // Ajusta ruta si es necesario
import { PuestoService, Puesto } from '../../services/puesto';    // Ajusta ruta si es necesario
import { Asignacion } from '../../services/asignacion'; // Importa la interfaz Asignacion

// Interfaz para el objeto combinado
export interface AsignacionCombinada extends Asignacion { // Extiende la original
  usuarioNombreCompleto?: string; // Opcional por si no se encuentra
  puestoNombre?: string;        // Opcional por si no se encuentra
}

@Component({
  selector: 'app-asignacion',
  standalone: false,
  templateUrl: './asignacion-interface.html',
  styleUrl: './asignacion-interface.scss'
})
export class asignacionInterface implements OnInit, AfterViewInit{
  // Cambiamos el tipo y nombre del DataSource
  public asignacionCombinadaDataSource = new MatTableDataSource<AsignacionCombinada>();
  // Cambiamos los nombres de las columnas para que coincidan con el HTML modificado
  displayedColumns: string[] = ['usuario', 'puesto'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // --- Mapas para búsqueda ---
  // IMPORTANTE: Verifica los tipos de ID en tus interfaces Usuario y Asignacion
  private usuariosMap = new Map<string, Usuario>(); // Asume Usuario.id es string (CC)
  private puestosMap = new Map<number, Puesto>(); // Asume Puesto.id es number

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    // --- INYECTA SERVICIOS ---
    private usuarioService: UsuarioService,
    private puestoService: PuestoService
  ) {}

  // --- REEMPLAZA ngOnInit ---
  ngOnInit(): void {
    // 1. Preparamos las TRES peticiones
    const asignaciones$ = this.http.get<Asignacion[]>("http://localhost:8080/api/asignacion/list-asignacion");
    const usuarios$ = this.usuarioService.getUsuarios();
    const puestos$ = this.puestoService.getPuesto();

    // 2. Usamos forkJoin
    forkJoin({
      asignaciones: asignaciones$,
      usuarios: usuarios$,
      puestos: puestos$
    }).subscribe({
      next: (data) => {
        // 3. Creamos los Mapas
        // Verifica que 'u.id' sea el campo correcto (ej. cédula) y sea string
        data.usuarios.forEach((u: Usuario) => this.usuariosMap.set(u.id, u));
        // Verifica que 'p.id' sea el campo correcto y sea number
        data.puestos.forEach((p: Puesto) => this.puestosMap.set(p.id, p));

        // 4. Transformamos los datos de asignaciones
        const combinedData: AsignacionCombinada[] = data.asignaciones.map(asignacion => {
          // Busca el usuario por ID. Asegúrate que 'asignacion.idUser' es el campo correcto y del tipo esperado por el mapa (string)
          const usuario = this.usuariosMap.get(asignacion.id_user); // Convierte a string por si acaso
          // Busca el puesto por ID. Asegúrate que 'asignacion.idPuesto' es el campo correcto y sea number
          const puesto = this.puestosMap.get(asignacion.id_puesto);

          // Log de depuración para verificar la búsqueda
          // console.log(`Asignacion ID: ${asignacion.id_asignacion}, Buscando Usuario ID: ${String(asignacion.idUser)}, Encontrado: ${!!usuario}`);
          // console.log(`Asignacion ID: ${asignacion.id_asignacion}, Buscando Puesto ID: ${asignacion.idPuesto}, Encontrado: ${!!puesto}`);

          return {
            ...asignacion, // Mantenemos datos originales de asignación
            usuarioNombreCompleto: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario Desconocido',
            puestoNombre: puesto ? puesto.puesto : 'Puesto Desconocido'
          };
        });

        // 5. Asignamos al DataSource
        this.asignacionCombinadaDataSource.data = combinedData;
        this.asignacionCombinadaDataSource.paginator = this.paginator;
        this.asignacionCombinadaDataSource.sort = this.sort;

        // 6. Configuramos el ordenamiento
        this.setupSorting();
      },
      error: err => {
        // Log más detallado del error
        console.error('Error al cargar datos combinados:', err);
        // Puedes añadir aquí un mensaje para el usuario si lo deseas
      }
    });
  }


  ngAfterViewInit() {
    // Enlaza los componentes a la fuente de datos
    this.asignacionCombinadaDataSource.paginator = this.paginator;
    this.asignacionCombinadaDataSource.sort = this.sort;

    // 7. Llama a la nueva función para establecer el orden inicial
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

  setupSorting(): void {
    this.asignacionCombinadaDataSource.sortingDataAccessor = (item: AsignacionCombinada, property: string) => {
      switch(property) {
        // Usa las nuevas propiedades para ordenar
        case 'usuario': return item.usuarioNombreCompleto || '';
        case 'puesto': return item.puestoNombre || '';
        default: return (item as any)[property];
      }
    };
  }

  //Llamar formulario y crear nuevo registro
  openCreateAsignacion(): void {
    const dialogRef = this.dialog.open(FormCrearAsignacion, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos recibidos del formulario:', result);
        this.ngOnInit(); // Recarga los datos para ver la nueva asignación
      }
    });
  }

  //Acciones de la tabla
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.asignacionCombinadaDataSource.filter = filtro.trim().toLowerCase();
  }

  orderByAscOrDesc(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado por ${sortState.active} ${sortState.direction === 'asc' ? 'ascendente' : 'descendente'}`);
    } else {
      this._liveAnnouncer.announce('Ordenamiento restablecido');
    }
  }
}