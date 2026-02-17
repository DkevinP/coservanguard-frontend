import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajeDialogComponent, MensajeDialogData } from './mensaje-dialog';

// Imports de Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// BLOQUE 1: Pruebas Generales y Caso de Éxito
describe('MensajeDialogComponent (Caso Éxito)', () => {
  let component: MensajeDialogComponent;
  let fixture: ComponentFixture<MensajeDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<MensajeDialogComponent>>;

  // Datos simulados: Enviamos solo lo básico para probar que los Defaults funcionen
  const mockDataExito: MensajeDialogData = {
    mensaje: 'Operación exitosa',
    esExito: true
    // No enviamos 'titulo' ni 'tipoBoton' para verificar que el constructor los llene
  };

  beforeEach(async () => {
    // Creamos el espía para poder verificar si se cierra la ventana
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [MensajeDialogComponent],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        // Inyectamos el espía de la ventana
        { provide: MatDialogRef, useValue: dialogRefSpy },
        // Inyectamos los datos falsos
        { provide: MAT_DIALOG_DATA, useValue: mockDataExito }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto ejecuta el constructor y ngOnInit
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar el título "Éxito" por defecto si esExito es true', () => {
    // El constructor debió llenar el título automáticamente
    expect(component.data.titulo).toBe('Éxito');
  });

  it('debería asignar el tipo de botón "unico" por defecto', () => {
    expect(component.data.tipoBoton).toBe('unico');
  });

  it('debería mostrar el ícono de check_circle (éxito)', () => {
    // Buscamos en el HTML compilado
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('.icon-success');
    expect(icon).toBeTruthy(); // Debe existir el icono verde
    expect(icon?.textContent).toContain('check_circle');
  });

  it('debería cerrar el diálogo al llamar a onCerrar', () => {
    component.onCerrar();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});

// BLOQUE 2: Pruebas para Caso de Error (Sobreescribimos la configuración)
describe('MensajeDialogComponent (Caso Error)', () => {
  let component: MensajeDialogComponent;
  let fixture: ComponentFixture<MensajeDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<MensajeDialogComponent>>;

  const mockDataError: MensajeDialogData = {
    mensaje: 'Algo salió mal',
    esExito: false
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [MensajeDialogComponent],
      imports: [MatDialogModule, MatIconModule, MatButtonModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        // AQUÍ CAMBIAMOS LOS DATOS: Simulamos un error
        { provide: MAT_DIALOG_DATA, useValue: mockDataError }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería asignar el título "Información" por defecto si esExito es false', () => {
    // Según tu lógica: this.data.titulo = this.data.esExito ? 'Éxito' : 'Información';
    expect(component.data.titulo).toBe('Información');
  });

  it('debería mostrar el ícono de highlight_off (error)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('.icon-error');
    expect(icon).toBeTruthy();
    expect(icon?.textContent).toContain('highlight_off');
  });
});
