import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCodigoQr } from './form-codigo-qr';

describe('FormCodigoQr', () => {
  let component: FormCodigoQr;
  let fixture: ComponentFixture<FormCodigoQr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCodigoQr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCodigoQr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
