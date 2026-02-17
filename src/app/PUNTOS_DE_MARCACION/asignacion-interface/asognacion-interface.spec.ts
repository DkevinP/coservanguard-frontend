import { ComponentFixture, TestBed } from '@angular/core/testing';
import { asignacionInterface, AsignacionCombinada } from './asignacion-interface'; // Asegúrate del nombre de la clase

// Imports de Material y Angular
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';

// Servicios y RxJS
import { UsuarioService } from '../../services/usuarios';
import { PuestoService } from '../../services/puesto';
import { of } from 'rxjs';

describe('asignacionInterface', () => {
  let component: asignacionInterface;
  let fixture: ComponentFixture<asignacionInterface>;

  // 1. Espías
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let puestoServiceSpy: jasmine.SpyObj<PuestoService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  // 2. Datos Falsos (Mocks)
  // Asignación cruda (como viene del backend)
  const mockAsignaciones = [
    { id: 1, id_user: '123456789', id_puesto: 50 }
  ];
  // Usuario (id debe ser string '123456789' para hacer match)
  const mockUsuarios = [
    { id: '123456789', nombre: 'Pepito', apellido: 'Perez', telefono: '555', id_cargo: 1, cedula: '123456789', correo: 'a@a.com' }
  ];
  // Puesto (id debe ser number 50 para hacer match)
  const mockPuestos = [
    { id: 50, puesto: 'Portería Norte', id_sede: 1 }
  ];

  beforeEach(async () => {
    // 3. Crear los espías
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    puestoServiceSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 4. Configurar respuestas
    // Tu componente llama a http.get para asignaciones
    httpSpy.get.and.returnValue(of(mockAsignaciones));
    // Y usa servicios para lo demás
    usuarioServiceSpy.getUsuarios.and.returnValue(of(mockUsuarios));
    puestoServiceSpy.getPuesto.and.returnValue(of(mockPuestos));

    await TestBed.configureTestingModule({
      declarations: [asignacionInterface],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: PuestoService, useValue: puestoServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(asignacionInterface);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga y Cruce de Datos ---
  it('debería cargar datos y mapear nombres de usuario y puesto', () => {
    // Verificamos llamadas
    expect(httpSpy.get).toHaveBeenCalled(); // Asignaciones
    expect(usuarioServiceSpy.getUsuarios).toHaveBeenCalled(); // Usuarios
    expect(puestoServiceSpy.getPuesto).toHaveBeenCalled(); // Puestos

    // Verificamos que la tabla tenga 1 dato
    expect(component.asignacionCombinadaDataSource.data.length).toBe(1);

    // Verificamos la magia del MAP: ¿Aparecen los nombres completos?
    const fila = component.asignacionCombinadaDataSource.data[0];

    // Validamos que se haya creado el nombre completo (Nombre + Apellido)
    expect(fila.usuarioNombreCompleto).toBe('Pepito Perez');
    // Validamos que se haya traído el nombre del puesto
    expect(fila.puestoNombre).toBe('Portería Norte');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar por nombre de usuario', () => {
    // Simulamos escribir "Pepito"
    const event = { target: { value: 'Pepito' } } as unknown as Event;
    component.filtrar(event);

    expect(component.asignacionCombinadaDataSource.filter).toBe('pepito');
  });
});
