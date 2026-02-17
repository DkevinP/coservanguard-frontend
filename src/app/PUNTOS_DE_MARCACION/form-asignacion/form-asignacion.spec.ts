import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearAsignacion } from './form-asignacion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// Servicios
import { FormHttpAsignacionService } from '../../services/form-http-asignacion';
import { UsuarioService } from '../../services/usuarios';
import { PuestoService } from '../../services/puesto';

describe('FormCrearAsignacion', () => {
  let component: FormCrearAsignacion;
  let fixture: ComponentFixture<FormCrearAsignacion>;

  let formServiceSpy: jasmine.SpyObj<FormHttpAsignacionService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let puestoServiceSpy: jasmine.SpyObj<PuestoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearAsignacion>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpAsignacionService', ['crearAsignacion']);
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    puestoServiceSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Mocks iniciales
    usuarioServiceSpy.getUsuarios.and.returnValue(of([]));
    puestoServiceSpy.getPuesto.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [FormCrearAsignacion],
      imports: [ReactiveFormsModule, MatDialogModule, MatSelectModule, BrowserAnimationsModule],
      providers: [
        { provide: FormHttpAsignacionService, useValue: formServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: PuestoService, useValue: puestoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearAsignacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar usuarios y puestos al iniciar', () => {
    expect(usuarioServiceSpy.getUsuarios).toHaveBeenCalled();
    expect(puestoServiceSpy.getPuesto).toHaveBeenCalled();
  });

  it('debería enviar datos válidos', () => {
    component.asignacionForm.setValue({
      id_user: 1,
      id_puesto: 5
    });

    formServiceSpy.crearAsignacion.and.returnValue(of({}));

    component.onSubmit();

    expect(formServiceSpy.crearAsignacion).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
