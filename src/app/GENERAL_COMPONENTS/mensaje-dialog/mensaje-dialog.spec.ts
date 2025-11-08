import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDialog } from './mensaje-dialog';

describe('MensajeDialog', () => {
  let component: MensajeDialog;
  let fixture: ComponentFixture<MensajeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
