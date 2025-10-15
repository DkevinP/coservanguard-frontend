import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearCargo } from './form-crear-cargo';

describe('FormCrearCargo', () => {
  let component: FormCrearCargo;
  let fixture: ComponentFixture<FormCrearCargo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearCargo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCrearCargo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
