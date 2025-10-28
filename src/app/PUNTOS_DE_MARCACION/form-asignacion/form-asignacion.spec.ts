import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAsignacionTurno } from './form-asignacion';

describe('FormAsignacionTurno', () => {
  let component: FormAsignacionTurno;
  let fixture: ComponentFixture<FormAsignacionTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAsignacionTurno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAsignacionTurno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
