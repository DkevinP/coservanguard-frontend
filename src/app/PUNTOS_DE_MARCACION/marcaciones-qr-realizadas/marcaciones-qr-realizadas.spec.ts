import { ComponentFixture, TestBed } from '@angular/core/testing';

import { marcacionQrRealizadaInterface } from './marcaciones-qr-realizadas';

describe('MarcacionesQrRealizadas', () => {
  let component: marcacionQrRealizadaInterface;
  let fixture: ComponentFixture<marcacionQrRealizadaInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [marcacionQrRealizadaInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(marcacionQrRealizadaInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
