import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearUsuario } from './form-crear-usuario';

describe('FormCrearUsuario', () => {
  let component: FormCrearUsuario;
  let fixture: ComponentFixture<FormCrearUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCrearUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
