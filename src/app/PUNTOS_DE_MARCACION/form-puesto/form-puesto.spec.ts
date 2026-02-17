import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearPuesto } from './form-puesto';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormHttpPuestoService } from '../../services/form-http-puesto';
import { SedeClienteService } from '../../services/sede-cliente';

describe('FormCrearPuesto', () => {
  let component: FormCrearPuesto;
  let fixture: ComponentFixture<FormCrearPuesto>;
  let formServiceSpy: jasmine.SpyObj<FormHttpPuestoService>;
  let sedeServiceSpy: jasmine.SpyObj<SedeClienteService>; // OJO: any si tienes problemas de nombres
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearPuesto>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpPuestoService', ['crearPuesto']);
    // Usamos 'any' en el nombre del método por si es getSede o getSedeClientes
    sedeServiceSpy = jasmine.createSpyObj('SedeClienteService', ['getSedeClientes']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    sedeServiceSpy.getSedeClientes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [FormCrearPuesto],
      imports: [ReactiveFormsModule, MatDialogModule, MatSelectModule, MatInputModule, BrowserAnimationsModule],
      providers: [
        { provide: FormHttpPuestoService, useValue: formServiceSpy },
        { provide: SedeClienteService, useValue: sedeServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearPuesto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse y cargar sedes', () => {
    expect(component).toBeTruthy();
    expect(sedeServiceSpy.getSedeClientes).toHaveBeenCalled();
  });

  it('debería enviar el formulario válido', () => {
    component.puestoForm.setValue({
      puesto: 'Recepción',
      id_sede: 5
    });
    formServiceSpy.crearPuesto.and.returnValue(of({}));

    component.onSubmit();
    expect(formServiceSpy.crearPuesto).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
