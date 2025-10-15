import { TestBed } from '@angular/core/testing';

import { Codigosqr } from './codigosqr';

describe('Codigosqr', () => {
  let service: Codigosqr;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Codigosqr);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
