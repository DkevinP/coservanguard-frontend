import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearSede } from './form-crear-sede';

describe('FormCrearSede', () => {
  let component: FormCrearSede;
  let fixture: ComponentFixture<FormCrearSede>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCrearSede]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCrearSede);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
