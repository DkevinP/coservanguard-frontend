import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearCliente } from './form-crear-cliente';

describe('FormCrearCliente', () => {
  let component: FormCrearCliente;
  let fixture: ComponentFixture<FormCrearCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCrearCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCrearCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
