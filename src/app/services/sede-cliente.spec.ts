import { TestBed } from '@angular/core/testing';

import { SedeCliente } from './sede-cliente';

describe('SedeCliente', () => {
  let service: SedeCliente;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SedeCliente);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
