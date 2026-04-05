import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcacionDetalle } from './marcacion-detalle';

describe('MarcacionDetalle', () => {
  let component: MarcacionDetalle;
  let fixture: ComponentFixture<MarcacionDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcacionDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcacionDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
