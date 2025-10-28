import { ComponentFixture, TestBed } from '@angular/core/testing';

import { asignacionInterface } from './asignacion-interface';

describe('AsignacionTurnoInterface', () => {
  let component: asignacionInterface;
  let fixture: ComponentFixture<asignacionInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [asignacionInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(asignacionInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
