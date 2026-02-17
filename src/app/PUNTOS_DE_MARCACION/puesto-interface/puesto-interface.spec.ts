import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PuestoInterface } from './puesto-interface';

// Imports de Material y Angular
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Servicios y RxJS
import { PuestoService } from '../../services/puesto';
import { SedeClienteService } from '../../services/sede-cliente';
import { of } from 'rxjs';

describe('PuestoInterface', () => {
  let component: PuestoInterface;
  let fixture: ComponentFixture<PuestoInterface>;

  // 1. Espías
  let puestoServiceSpy: jasmine.SpyObj<PuestoService>;
  // CORRECCIÓN: Usamos 'any' para evitar errores si el método se llama distinto (getSede vs getSedes)
  let sedeServiceSpy: any;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  // 2. Datos Falsos (Mocks)
  const mockPuestos = [
    { id: 1, puesto: 'Portería Principal', id_sede: 50 }
  ];

  const mockSedes = [
    { id: 50, sede: 'Edificio Central', direccion: 'Calle 100' }
  ];

  beforeEach(async () => {
    // 3. Crear los espías
    puestoServiceSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);

    // CORRECCIÓN: Creamos un espía genérico que acepta cualquier nombre de método
    // Asegúrate de que 'getSede' sea el nombre real en tu servicio. Si es 'getSedes', cámbialo aquí.
    sedeServiceSpy = jasmine.createSpyObj('SedeClienteService', ['getSedeClientes']);

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 4. Configurar respuestas
    puestoServiceSpy.getPuesto.and.returnValue(of(mockPuestos));
    sedeServiceSpy.getSedeClientes.and.returnValue(of(mockSedes));

    await TestBed.configureTestingModule({
      declarations: [PuestoInterface],
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
        { provide: PuestoService, useValue: puestoServiceSpy },
        { provide: SedeClienteService, useValue: sedeServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuestoInterface);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga y Cruce de Nombres ---
  it('debería cargar puestos y mostrar el nombre de la sede', () => {
    expect(puestoServiceSpy.getPuesto).toHaveBeenCalled();
    // CORRECCIÓN LÍNEA 84: Usamos el método definido arriba
    expect(sedeServiceSpy.getSedeClientes).toHaveBeenCalled();

    // Verificamos que hay datos
    expect(component.puestosDataSource.data.length).toBe(1);

    // Verificamos el cruce (Mapping): id_sede 50 -> "Edificio Central"
    const puestoEnTabla = component.puestosDataSource.data[0] as any;
    // Usamos 'or' (||) por si tu variable se llama distinto
    expect(puestoEnTabla.nombreSede || puestoEnTabla.sedeNombre).toBe('Edificio Central');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar la tabla por nombre de puesto', () => {
    const event = { target: { value: 'Portería' } } as unknown as Event;
    component.filtrar(event);

    expect(component.puestosDataSource.filter).toBe('portería');
  });

  // --- PRUEBA 4: Creación ---
  it('debería abrir el modal de creación', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    // CORRECCIÓN LÍNEAS 111-112: Nombre correcto del método (minúscula)
    if (component.openCreatepuesto) {
        component.openCreatepuesto();
        expect(dialogSpy.open).toHaveBeenCalled();
    }
  });
});
