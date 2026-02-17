import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearCargo } from './form-crear-cargo';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormHttpCargoService } from '../../services/form-http-cargo';

describe('FormCrearCargo', () => {
  let component: FormCrearCargo;
  let fixture: ComponentFixture<FormCrearCargo>;
  let formServiceSpy: jasmine.SpyObj<FormHttpCargoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearCargo>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpCargoService', ['crearCargo']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [FormCrearCargo],
      imports: [ReactiveFormsModule, MatDialogModule, MatInputModule, BrowserAnimationsModule],
      providers: [
        { provide: FormHttpCargoService, useValue: formServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearCargo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería enviar el cargo si es válido', () => {
    component.cargoForm.setValue({ nombre_cargo: 'Jefe' });
    formServiceSpy.crearCargo.and.returnValue(of({}));

    component.onSubmit();
    expect(formServiceSpy.crearCargo).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
