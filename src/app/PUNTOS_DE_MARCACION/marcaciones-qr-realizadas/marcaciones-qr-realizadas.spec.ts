import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { marcacionQrRealizadaInterface } from './marcaciones-qr-realizadas';

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
import { AsignacionService } from '../../services/asignacion';
import { PuestoService } from '../../services/puesto';
import { SedeClienteService } from '../../services/sede-cliente';
import { UsuarioService } from '../../services/usuarios';
import { MarcacionQrDoneService } from '../../services/marcacion-qr-done';
import { of } from 'rxjs';

describe('MarcacionesQrRealizadas', () => {
  let component: marcacionQrRealizadaInterface;
  let fixture: ComponentFixture<marcacionQrRealizadaInterface>;

  // 1. Espías
  let asignacionSpy: jasmine.SpyObj<AsignacionService>;
  let puestoSpy: jasmine.SpyObj<PuestoService>;
  let sedeSpy: jasmine.SpyObj<SedeClienteService>;
  let usuarioSpy: jasmine.SpyObj<UsuarioService>;
  let marcacionSpy: jasmine.SpyObj<MarcacionQrDoneService>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  // 2. Datos Falsos con 'as any' para evitar errores de tipado
  const mockSedes = [{ id: 100, sede: 'Edificio Central', direccion: 'Calle 1', id_cliente: 1 }];
  const mockPuestos = [{ id: 50, puesto: 'Portería 1', id_sede: 100 }];
  const mockUsuarios = [{ id: 'U1', nombre: 'Juan', apellido: 'Perez', telefono: '123', id_cargo: 1, cedula: '111', correo: 'a@a.com' }];
  const mockAsignaciones = [{ id: 10, id_user: 'U1', id_puesto: 50 }];
  const mockMarcaciones = [{
    id: 1, id_asignacion: 10, fecha: new Date(), latitude: '4.0', longitude: '-74.0',
    id_codigo: 1, IdistanciaM: '10', Bes_cercano: true
  }];

  beforeEach(async () => {
    // 3. Crear Espías
    asignacionSpy = jasmine.createSpyObj('AsignacionService', ['getAsignacion']);
    puestoSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    sedeSpy = jasmine.createSpyObj('SedeClienteService', ['getSedeClientes']);
    usuarioSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    marcacionSpy = jasmine.createSpyObj('MarcacionQrDoneService', ['getMarcaciones']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 4. Configurar Respuestas (usamos 'as any' para simplificar)
    asignacionSpy.getAsignacion.and.returnValue(of(mockAsignaciones as any));
    puestoSpy.getPuesto.and.returnValue(of(mockPuestos as any));
    sedeSpy.getSedeClientes.and.returnValue(of(mockSedes as any));
    usuarioSpy.getUsuarios.and.returnValue(of(mockUsuarios as any));
    marcacionSpy.getMarcaciones.and.returnValue(of(mockMarcaciones as any));

    await TestBed.configureTestingModule({
      declarations: [marcacionQrRealizadaInterface],
      imports: [
        MatPaginatorModule, MatSortModule, MatTableModule,
        MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AsignacionService, useValue: asignacionSpy },
        { provide: PuestoService, useValue: puestoSpy },
        { provide: SedeClienteService, useValue: sedeSpy },
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: MarcacionQrDoneService, useValue: marcacionSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(marcacionQrRealizadaInterface);
    component = fixture.componentInstance;

    // NOTA IMPORTANTE: Quitamos fixture.detectChanges() de aquí para controlarlo manualmente
    // en cada prueba 'fakeAsync'.
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    fixture.detectChanges(); // Iniciamos manual
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga y Cruce (Con fakeAsync) ---
  it('debería cargar catálogos y cruzar toda la información', fakeAsync(() => {
    fixture.detectChanges(); // 1. Dispara ngOnInit -> timer(0)

    tick(100); // 2. Avanzamos el tiempo 100ms para que el timer(0) se ejecute

    // 3. Verificaciones
    expect(sedeSpy.getSedeClientes).toHaveBeenCalled();
    expect(marcacionSpy.getMarcaciones).toHaveBeenCalled(); // Ahora sí debe haberse llamado

    expect(component.codigoQrDoneDataSource.data.length).toBe(1);

    const fila = component.codigoQrDoneDataSource.data[0] as any;
    expect(fila.sede).toBe('Edificio Central');
    expect(fila.usuario).toBe('Juan Perez');

    discardPeriodicTasks(); // Limpiamos el timer infinito
  }));

  // --- PRUEBA 3: Polling 5 segundos ---
  it('debería actualizarse automáticamente después de 5 segundos', fakeAsync(() => {
    fixture.detectChanges(); // Inicia timer(0)
    tick(100); // Ejecuta la primera llamada

    // Reseteamos el espía para contar desde cero
    marcacionSpy.getMarcaciones.calls.reset();

    // Avanzamos 5 segundos (5000ms)
    tick(5000);

    // Debería haberse llamado de nuevo
    expect(marcacionSpy.getMarcaciones).toHaveBeenCalled();

    discardPeriodicTasks(); // Limpiamos
  }));

  // --- PRUEBA 4: Filtro ---
  it('debería filtrar la tabla', fakeAsync(() => {
    fixture.detectChanges();
    tick(100); // Cargamos datos primero

    const event = { target: { value: 'Juan' } } as unknown as Event;
    component.filtrar(event);
    expect(component.codigoQrDoneDataSource.filter).toBe('juan');

    discardPeriodicTasks();
  }));
});
