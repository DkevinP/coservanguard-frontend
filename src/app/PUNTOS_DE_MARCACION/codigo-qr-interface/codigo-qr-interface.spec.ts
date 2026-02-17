import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodigoQrInterface } from './codigo-qr-interface';

// Imports Material y Angular
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Servicios y RxJS
import { PuestoService } from '../../services/puesto';
import { CodigoQrService } from '../../services/codigosqr';
import { of } from 'rxjs';

describe('CodigoQrInterface', () => {
  let component: CodigoQrInterface;
  let fixture: ComponentFixture<CodigoQrInterface>;

  // 1. Espías
  let puestoServiceSpy: jasmine.SpyObj<PuestoService>;
  let codigoQrServiceSpy: jasmine.SpyObj<CodigoQrService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

 // 2. Datos Falsos CORREGIDOS
  const mockPuestos = [
    {
      id: 10,
      puesto: 'Entrada Principal',
      id_sede: 1 // <--- FALTABA ESTO (Requerido por tu interfaz Puesto)
    }
  ];

  const mockQrs = [
    {
      id: 1,
      qr: 'base64string...',
      id_puesto: 10,
      latitude: 4.60,  // <--- CAMBIO: Sin comillas (number)
      longitude: -74.08 // <--- CAMBIO: Sin comillas (number)
    }
  ];

  beforeEach(async () => {
    // 3. Crear Espías
    puestoServiceSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    codigoQrServiceSpy = jasmine.createSpyObj('CodigoQrService', ['getCodigoQr']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 4. Configurar Respuestas
    puestoServiceSpy.getPuesto.and.returnValue(of(mockPuestos));
    codigoQrServiceSpy.getCodigoQr.and.returnValue(of(mockQrs));

    await TestBed.configureTestingModule({
      declarations: [CodigoQrInterface],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PuestoService, useValue: puestoServiceSpy },
        { provide: CodigoQrService, useValue: codigoQrServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigoQrInterface);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga y Cruce de Datos ---
  it('debería cargar QRs y mostrar el nombre del puesto', () => {
    expect(puestoServiceSpy.getPuesto).toHaveBeenCalled();
    expect(codigoQrServiceSpy.getCodigoQr).toHaveBeenCalled();

    // Validamos que hay datos
    expect(component.codigoQrDataSource.data.length).toBe(1);

    // Validamos el MAP (id_puesto 10 -> 'Entrada Principal')
    const item = component.codigoQrDataSource.data[0] as any;
    expect(item.puestoNombre).toBe('Entrada Principal');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar por nombre de puesto', () => {
    const event = { target: { value: 'Entrada' } } as unknown as Event;
    component.filtrar(event);
    expect(component.codigoQrDataSource.filter).toBe('entrada');
  });

  // --- PRUEBA 4: Abrir Modal de Creación ---
  it('debería abrir el modal de crear QR', () => {
    // Simulamos respuesta del dialog
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    // Ojo con el nombre (Mayúscula/Minúscula). En tu HTML es 'openCreatecodigoQr'
    if (component.openCreatecodigoQr) {
      component.openCreatecodigoQr();
      expect(dialogSpy.open).toHaveBeenCalled();
    }
  });

  // --- PRUEBA 5: Abrir Modal de Ver QR ---
  it('debería abrir el modal para ver el QR', () => {
    const item = mockQrs[0];
    component.openQrDialog(item);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
