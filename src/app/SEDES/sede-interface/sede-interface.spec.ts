import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeInterface } from './sede-interface';

describe('SedeInterface', () => {
  let component: SedeInterface;
  let fixture: ComponentFixture<SedeInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SedeInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
