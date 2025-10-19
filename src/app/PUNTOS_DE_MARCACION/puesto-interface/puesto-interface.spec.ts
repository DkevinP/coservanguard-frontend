import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoInterface } from './puesto-interface';

describe('PuestoInterface', () => {
  let component: PuestoInterface;
  let fixture: ComponentFixture<PuestoInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuestoInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuestoInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
