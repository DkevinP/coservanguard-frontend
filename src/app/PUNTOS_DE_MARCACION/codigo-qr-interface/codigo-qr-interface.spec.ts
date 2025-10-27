import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoQrInterface } from './codigo-qr-interface';

describe('CodigoQrInterface', () => {
  let component: CodigoQrInterface;
  let fixture: ComponentFixture<CodigoQrInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodigoQrInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigoQrInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
