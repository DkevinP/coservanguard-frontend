import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearUsuario } from './form-crear-usuario';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormHttpUsuarioService } from '../../services/form-http-usuario';
import { CargoService } from '../../services/cargo';

describe('FormCrearUsuario', () => {
  let component: FormCrearUsuario;
  let fixture: ComponentFixture<FormCrearUsuario>;
  let formServiceSpy: jasmine.SpyObj<FormHttpUsuarioService>;
  let cargoServiceSpy: jasmine.SpyObj<CargoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearUsuario>>;
  // Nota: Si no usaste el dialog en este componente, puedes quitar este espía,
  // pero como sugerimos estandarizarlo, lo incluyo.
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpUsuarioService', ['crearUsuario']);
    cargoServiceSpy = jasmine.createSpyObj('CargoService', ['getCargo']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    cargoServiceSpy.getCargo.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [FormCrearUsuario],
      imports: [ReactiveFormsModule, MatDialogModule, MatSelectModule, MatInputModule, BrowserAnimationsModule],
      providers: [
        { provide: FormHttpUsuarioService, useValue: formServiceSpy },
        { provide: CargoService, useValue: cargoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        // Opcional si no inyectas MatDialog
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar cargos al inicio', () => {
    expect(cargoServiceSpy.getCargo).toHaveBeenCalled();
  });

  it('debería crear usuario correctamente', () => {
    component.usuarioForm.setValue({
      nombre: 'Juan',
      apellido: 'Perez',
      cedula: '123',
      contrasena: 'pass',
      telefono: '555',
      correo: 'juan@mail.com',
      id_cargo: 1
    });

    formServiceSpy.crearUsuario.and.returnValue(of({}));

    component.onSubmit();
    expect(formServiceSpy.crearUsuario).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
