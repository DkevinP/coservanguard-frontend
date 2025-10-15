import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearTurnos } from './form-crear-turnos';

describe('FormCrearTurnos', () => {
  let component: FormCrearTurnos;
  let fixture: ComponentFixture<FormCrearTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearTurnos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCrearTurnos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
