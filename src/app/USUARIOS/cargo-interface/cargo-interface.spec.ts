import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoInterface } from './cargo-interface';

describe('CargoInterface', () => {
  let component: CargoInterface;
  let fixture: ComponentFixture<CargoInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
