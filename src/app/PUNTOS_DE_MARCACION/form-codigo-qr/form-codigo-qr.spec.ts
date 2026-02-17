import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearCodigoQr } from './form-codigo-qr';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormHttpCodigoQrService } from '../../services/form-http-codigo-qr';
import { PuestoService } from '../../services/puesto';

describe('FormCrearCodigoQr', () => {
  let component: FormCrearCodigoQr;
  let fixture: ComponentFixture<FormCrearCodigoQr>;
  let formServiceSpy: jasmine.SpyObj<FormHttpCodigoQrService>;
  let puestoServiceSpy: jasmine.SpyObj<PuestoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearCodigoQr>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpCodigoQrService', ['crearCodigoQr']);
    puestoServiceSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    puestoServiceSpy.getPuesto.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [FormCrearCodigoQr],
      imports: [ReactiveFormsModule, MatDialogModule, MatSelectModule, BrowserAnimationsModule],
      providers: [
        { provide: FormHttpCodigoQrService, useValue: formServiceSpy },
        { provide: PuestoService, useValue: puestoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearCodigoQr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería enviar el ID del puesto al servicio', () => {
    component.codigoQrForm.setValue({ id_puesto: 10 });
    formServiceSpy.crearCodigoQr.and.returnValue(of({}));

    component.onSubmit();

    // Verificamos que se llamó con el número 10
    expect(formServiceSpy.crearCodigoQr).toHaveBeenCalledWith(10);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
