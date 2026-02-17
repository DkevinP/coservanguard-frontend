import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodigoQr } from './codigo-qr';

// Imports de Material y Angular
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('CodigoQr', () => {
  let component: CodigoQr;
  let fixture: ComponentFixture<CodigoQr>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CodigoQr>>;

  // Datos Simulados (Mock Data)
  const mockData = {
    puestoNombre: 'Portería Norte',
    qr: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', // Un pixel base64 válido
    id_puesto: 123,
    latitude: '4.60',
    longitude: '-74.08'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [CodigoQr],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigoQr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Visualización de Datos ---
  it('debería mostrar la información del puesto en el HTML', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Verificamos el título
    const titulo = compiled.querySelector('h1')?.textContent;
    expect(titulo).toContain('Portería Norte');

    // Verificamos que la imagen tenga el src correcto
    const img = compiled.querySelector('img');
    expect(img?.src).toContain('data:image/png;base64,' + mockData.qr);
  });

  // --- PRUEBA 3: Cerrar ---
  it('debería cerrar el diálogo al llamar a close()', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  // --- PRUEBA 4: Descarga (Lógica del DOM) ---
  it('debería crear un enlace y simular click para descargar', () => {
    // Espiamos las funciones del documento para no ensuciar el DOM real
    const createElementSpy = spyOn(document, 'createElement').and.callThrough();
    const appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
    const removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();

    component.downloadQr();

    // 1. Verificamos que creó un elemento <a>
    expect(createElementSpy).toHaveBeenCalledWith('a');

    // 2. Verificamos que lo agregó al body
    expect(appendChildSpy).toHaveBeenCalled();

    // 3. Verificamos que lo removió después (limpieza)
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
