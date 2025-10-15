import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteInterface } from './cliente-interface';

describe('ClienteInterface', () => {
  let component: ClienteInterface;
  let fixture: ComponentFixture<ClienteInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClienteInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
