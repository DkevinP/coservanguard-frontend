import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearCliente } from './form-crear-cliente';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { FormHttpClienteService } from '../../services/form-http-cliente';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

describe('FormCrearCliente', () => {
  let component: FormCrearCliente;
  let fixture: ComponentFixture<FormCrearCliente>;

  // Espías
  let formServiceSpy: jasmine.SpyObj<FormHttpClienteService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearCliente>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpClienteService', ['crearCliente']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [FormCrearCliente],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: FormHttpClienteService, useValue: formServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería ser inválido si el formulario está vacío', () => {
    expect(component.clienteForm.valid).toBeFalse();
  });

  it('debería enviar los datos si el formulario es válido (Caso Éxito)', () => {
    // 1. Llenar formulario
    component.clienteForm.setValue({
      nombre: 'Empresa Test',
      nit: '1234567', // 7 dígitos
      telefono: '3001234567', // 10 dígitos
      email: 'test@test.com'
    });

    // 2. Configurar respuesta exitosa del servicio
    formServiceSpy.crearCliente.and.returnValue(of({ success: true }));

    // 3. Ejecutar
    component.onSubmit();

    // 4. Verificaciones
    expect(formServiceSpy.crearCliente).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled(); // Debe cerrarse
    expect(dialogSpy.open).toHaveBeenCalledWith(MensajeDialogComponent, jasmine.any(Object)); // Mensaje éxito
  });

  it('debería manejar el error del servidor (Caso Error)', () => {
    component.clienteForm.setValue({
      nombre: 'Empresa Test',
      nit: '1234567',
      telefono: '3001234567',
      email: 'test@test.com'
    });

    // Simular error
    formServiceSpy.crearCliente.and.returnValue(throwError(() => new Error('Error backend')));

    component.onSubmit();

    expect(dialogSpy.open).toHaveBeenCalled(); // Mensaje de error
    expect(dialogRefSpy.close).not.toHaveBeenCalled(); // NO debe cerrarse el formulario
  });
});
