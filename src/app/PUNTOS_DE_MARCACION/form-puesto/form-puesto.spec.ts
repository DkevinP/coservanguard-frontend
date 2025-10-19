import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPuesto } from './form-puesto';

describe('FormPuesto', () => {
  let component: FormPuesto;
  let fixture: ComponentFixture<FormPuesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPuesto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPuesto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
