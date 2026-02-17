import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearSede } from './form-crear-sede';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormHttpSedeService } from '../../services/form-http-sede';
import { ClienteService } from '../../services/cliente';

describe('FormCrearSede', () => {
  let component: FormCrearSede;
  let fixture: ComponentFixture<FormCrearSede>;
  let formServiceSpy: jasmine.SpyObj<FormHttpSedeService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearSede>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpSedeService', ['crearSede']);
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    clienteServiceSpy.getClientes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [FormCrearSede],
      imports: [ReactiveFormsModule, MatDialogModule, MatSelectModule, MatInputModule, BrowserAnimationsModule],
      providers: [
        { provide: FormHttpSedeService, useValue: formServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearSede);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse y cargar clientes', () => {
    expect(component).toBeTruthy();
    expect(clienteServiceSpy.getClientes).toHaveBeenCalled();
  });

  it('debería enviar el formulario válido', () => {
    component.sedeForm.setValue({
      sede: 'Norte',
      direccion: 'Calle 123',
      id_cliente: 1
    });
    formServiceSpy.crearSede.and.returnValue(of({}));

    component.onSubmit();
    expect(formServiceSpy.crearSede).toHaveBeenCalled();
  });
});
