import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnoInterface } from './turnos';

// Imports Material y Angular
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Servicios y RxJS
import { TurnoService } from '../../services/turnos';
import { UsuarioService } from '../../services/usuarios';
import { PuestoService } from '../../services/puesto';
import { of } from 'rxjs';

describe('TurnoInterface', () => {
  let component: TurnoInterface;
  let fixture: ComponentFixture<TurnoInterface>;

  // 1. Espías
  let turnoSpy: jasmine.SpyObj<TurnoService>;
  let usuarioSpy: jasmine.SpyObj<UsuarioService>;
  let puestoSpy: jasmine.SpyObj<PuestoService>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;
  let dialogSpy: jasmine.SpyObj<any>; // Usamos any para el MatDialog y evitar conflictos de tipos

  // 2. Datos Falsos (IDs coincidentes para probar el cruce)
  const mockUsuarios = [{ id: '101', nombre: 'Pepito', apellido: 'Perez' }];
  const mockPuestos = [{ id: 50, puesto: 'Portería Norte' }];

  const mockTurnos = [
    {
      id: 1,
      id_cc: 101,    // Debe coincidir con mockUsuarios (ojo: tu componente lo convierte a Number)
      id_puesto: 50, // Debe coincidir con mockPuestos
      hora_inicio: '06:00',
      hora_fin: '14:00'
    }
  ];

  beforeEach(async () => {
    // 3. Crear Espías
    turnoSpy = jasmine.createSpyObj('TurnoService', ['getTurnos']);
    usuarioSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    puestoSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // 4. Configurar Respuestas (usando 'as any' para evitar bloqueos por campos faltantes)
    turnoSpy.getTurnos.and.returnValue(of(mockTurnos as any));
    usuarioSpy.getUsuarios.and.returnValue(of(mockUsuarios as any));
    puestoSpy.getPuesto.and.returnValue(of(mockPuestos as any));

    await TestBed.configureTestingModule({
      declarations: [TurnoInterface],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule, // Importante para el constructor
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TurnoService, useValue: turnoSpy },
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: PuestoService, useValue: puestoSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy },
        // Sobreescribimos el MatDialog real con nuestro espía
        // Nota: MatDialog se inyecta por clase, no por token, pero esto suele funcionar en tests unitarios simples
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoInterface);
    component = fixture.componentInstance;

    // Inyectamos el espía del dialog manualmente si el provider de arriba no lo captura (seguridad extra)
    component.dialog = dialogSpy;

    fixture.detectChanges(); // Dispara ngOnInit
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga y Cruce de Datos ---
  it('debería cargar turnos y mapear nombres de usuario y puesto', () => {
    expect(turnoSpy.getTurnos).toHaveBeenCalled();
    expect(usuarioSpy.getUsuarios).toHaveBeenCalled();
    expect(puestoSpy.getPuesto).toHaveBeenCalled();

    // Validamos que hay datos en la tabla
    expect(component.turnosDataSource.data.length).toBe(1);

    // Validamos el mapeo (La parte difícil)
    // El id_cc 101 se debió convertir en "Pepito Perez"
    // El id_puesto 50 se debió convertir en "Portería Norte"
    const turnoEnTabla = component.turnosDataSource.data[0] as any;

    expect(turnoEnTabla.usuarioNombre).toBe('Pepito Perez');
    expect(turnoEnTabla.puestoNombre).toBe('Portería Norte');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar la tabla', () => {
    const event = { target: { value: 'Pepito' } } as unknown as Event;
    component.filtrar(event);
    expect(component.turnosDataSource.filter).toBe('pepito');
  });

  // --- PRUEBA 4: Abrir Modal de Creación ---
  it('debería abrir el modal al llamar openCreateTurno', () => {
    // Simulamos que el diálogo devuelve algo al cerrarse
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.openCreateTurno();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

// --- PRUEBA 5: Ordenamiento Personalizado ---
  it('debería configurar el ordenamiento personalizado', () => {
    // Verificamos que se definió la función sortingDataAccessor
    expect(component.turnosDataSource.sortingDataAccessor).toBeDefined();

    // Probamos la lógica interna
    const item = { usuarioNombre: 'Ana', puestoNombre: 'Recepción' } as any;

    // CORRECCIÓN: Usamos 'id_cc' porque así llamamos a la columna en el paso anterior
    const valorOrdenUsuario = component.turnosDataSource.sortingDataAccessor(item, 'id_cc');
    expect(valorOrdenUsuario).toBe('Ana');

    // CORRECCIÓN: Usamos 'id_puesto'
    const valorOrdenPuesto = component.turnosDataSource.sortingDataAccessor(item, 'id_puesto');
    expect(valorOrdenPuesto).toBe('Recepción');
  });
});
