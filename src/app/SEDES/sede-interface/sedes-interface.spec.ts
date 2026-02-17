import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SedeInterface } from './sede-interface';

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

// Importamos el Servicio y RxJS
import { ClienteService } from '../../services/cliente';
import { of } from 'rxjs';

describe('SedeInterface', () => {
  let component: SedeInterface;
  let fixture: ComponentFixture<SedeInterface>;

  // 1. Definimos los Espías (Mocks)
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  // --- CORRECCIÓN LÍNEA 49: DATOS FALSOS ---
  // Ajustamos los tipos para que coincidan con tus interfaces estrictas
  const mockSedes = [
    // Nota: En tu interfaz SedeCliente, 'direccion' es number, así que pongo un número
    { id: 1, sede: 'Sede Norte', direccion: 12345, id_cliente: 100 }
  ];

const mockClientes = [
    {
      id: 100,
      nombre: 'Empresa X',
      nit: 900123,
      telefono: 3001234567, // <--- ¡AQUÍ! Sin comillas, porque tu interfaz pide un number
      email: 'a@a.com'
    }
  ];

  beforeEach(async () => {
    // 2. Creamos los objetos espía
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 3. Configuramos las respuestas automáticas
    httpSpy.get.and.returnValue(of(mockSedes));
    clienteServiceSpy.getClientes.and.returnValue(of(mockClientes));

    await TestBed.configureTestingModule({
      declarations: [SedeInterface],
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
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeInterface);
    component = fixture.componentInstance;

    // Disparamos ngOnInit automáticamente
    fixture.detectChanges();
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga de Datos y Cruce de Información ---
  it('debería cargar sedes y clientes, y cruzar los nombres correctamente', () => {
    // Verificamos que se llamaron a las APIs
    expect(httpSpy.get).toHaveBeenCalled();
    expect(clienteServiceSpy.getClientes).toHaveBeenCalled();

    // Verificamos que la tabla tiene datos
    expect(component.sedesDataSource.data.length).toBe(1);

    // --- CORRECCIÓN LÍNEA 95 ---
    // Usamos 'as any' para acceder a la propiedad dinámica 'clienteNombre'
    // sin que TypeScript nos regañe.
    const sedeEnTabla = component.sedesDataSource.data[0] as any;

    expect(sedeEnTabla.clienteNombre).toBe('Empresa X');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar la tabla', () => {
    // Simulamos un evento de teclado en el input de filtro
    const event = { target: { value: 'Norte' } } as unknown as Event;

    component.filtrar(event);

    // Verificamos que el filtro del DataSource se actualizó
    expect(component.sedesDataSource.filter).toBe('norte');
  });
});
