import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Usuarios } from './usuario'; // Nombre de tu clase del componente

// Imports de Material y Angular
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Útil por si queda alguna referencia suelta

// Servicios y RxJS
import { UsuarioService } from '../../services/usuarios';
import { CargoService } from '../../services/cargo';
import { of } from 'rxjs';

describe('Usuarios Interface', () => {
  let component: Usuarios;
  let fixture: ComponentFixture<Usuarios>;

  // 1. Definimos los Espías
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let cargoServiceSpy: jasmine.SpyObj<CargoService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  // 2. Datos Falsos (Mocks)
  // Usuario: id_cargo es un número que debe coincidir con el cargo de abajo
  const mockUsuarios = [
    {
      id: '101',
      nombre: 'Ana',
      apellido: 'Gomez',
      cedula: '101010',
      correo: 'ana@test.com',
      telefono: '3001112233',
      id_cargo: 5 // Este ID buscará el nombre en mockCargos
    }
  ];

  // Cargo: El id 5 corresponde a "Supervisor"
  const mockCargos = [
    { id: 5, nombre_cargo: 'Supervisor' },
    { id: 2, nombre_cargo: 'Guardia' }
  ];

  beforeEach(async () => {
    // 3. Crear los espías
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    cargoServiceSpy = jasmine.createSpyObj('CargoService', ['getCargo']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 4. Configurar respuestas automáticas (Simular ForkJoin)
    usuarioServiceSpy.getUsuarios.and.returnValue(of(mockUsuarios));
    cargoServiceSpy.getCargo.and.returnValue(of(mockCargos));

    await TestBed.configureTestingModule({
      declarations: [Usuarios],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: CargoService, useValue: cargoServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usuarios);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga y Mapeo de Cargos ---
  it('debería cargar usuarios y cargos, y mostrar el nombre del cargo', () => {
    // Verificamos que se llamaron ambos servicios
    expect(usuarioServiceSpy.getUsuarios).toHaveBeenCalled();
    expect(cargoServiceSpy.getCargo).toHaveBeenCalled();

    // Verificamos que la tabla tiene datos
    expect(component.usuariosDataSource.data.length).toBe(1);

    // Verificamos la lógica del MAP (id_cargo 5 -> "Supervisor")
    const usuarioEnTabla = component.usuariosDataSource.data[0];

    // Aquí validamos que tu código haya creado la propiedad 'cargoNombre' correctamente
    expect(usuarioEnTabla.cargoNombre).toBe('Supervisor');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar por nombre, apellido o cédula', () => {
    // Simulamos escribir "Ana"
    const event = { target: { value: 'Ana' } } as unknown as Event;
    component.filtrar(event);

    // Verificamos que el DataSource recibió el filtro limpio
    expect(component.usuariosDataSource.filter).toBe('ana');
  });

  // --- PRUEBA 4: Ordenamiento Personalizado ---
  it('debería configurar el ordenamiento personalizado para cargos', () => {
    // Esta prueba verifica que definiste el sortingDataAccessor
    // para que al ordenar por 'id_cargo', en realidad ordene por el nombre
    const item = { cargoNombre: 'Supervisor', id_cargo: 5 } as any;

    // Simulamos que la tabla pide el valor para ordenar por 'id_cargo'
    const valorParaOrdenar = component.usuariosDataSource.sortingDataAccessor(item, 'id_cargo');

    // Debería devolver el nombre, no el número
    expect(valorParaOrdenar).toBe('Supervisor');
  });
});
