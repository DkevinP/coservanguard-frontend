import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcacionesQrRealizadas } from './marcaciones-qr-realizadas';

describe('MarcacionesQrRealizadas', () => {
  let component: MarcacionesQrRealizadas;
  let fixture: ComponentFixture<MarcacionesQrRealizadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcacionesQrRealizadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcacionesQrRealizadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
