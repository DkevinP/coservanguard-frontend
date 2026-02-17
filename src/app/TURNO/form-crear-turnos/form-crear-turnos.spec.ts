/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCrearTurno } from './form-crear-turnos';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FormHttpTurnoService } from '../../services/form-http-turno';
import { UsuarioService } from '../../services/usuarios';
import { PuestoService } from '../../services/puesto';

describe('FormCrearTurno', () => {
  let component: FormCrearTurno;
  let fixture: ComponentFixture<FormCrearTurno>;
  let formServiceSpy: jasmine.SpyObj<FormHttpTurnoService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let puestoServiceSpy: jasmine.SpyObj<PuestoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormCrearTurno>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    formServiceSpy = jasmine.createSpyObj('FormHttpTurnoService', ['crearTurno']);
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    puestoServiceSpy = jasmine.createSpyObj('PuestoService', ['getPuesto']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    usuarioServiceSpy.getUsuarios.and.returnValue(of([]));
    puestoServiceSpy.getPuesto.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [FormCrearTurno],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: FormHttpTurnoService, useValue: formServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: PuestoService, useValue: puestoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCrearTurno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería calcular correctamente las fechas combinadas', () => {
    // Simulamos inputs
    const fecha = new Date('2024-01-01T00:00:00');
    component.turnoForm.patchValue({
      startDate: fecha,
      startTime: '08:30'
    });

    const resultado = component.getCombinedStartDate();

    expect(resultado).toBeTruthy();
    expect(resultado?.getHours()).toBe(8);
    expect(resultado?.getMinutes()).toBe(30);
  });

  it('debería enviar el formulario con fechas procesadas', () => {
    const fecha = new Date();
    component.turnoForm.setValue({
      id_cc: 123,
      id_puesto: 456,
      startDate: fecha,
      startTime: '08:00',
      endDate: fecha,
      endTime: '17:00'
    });

    formServiceSpy.crearTurno.and.returnValue(of({}));

    component.onSubmit();

    expect(formServiceSpy.crearTurno).toHaveBeenCalled();
    // Verificamos que el argumento enviado tenga hora_inicio y hora_fin
    const args = formServiceSpy.crearTurno.calls.mostRecent().args[0];
    expect(args.hora_inicio).toBeDefined();
    expect(args.hora_fin).toBeDefined();
  });
});

*/
