import { TestBed } from '@angular/core/testing';

import { Cargo } from './cargo';

describe('Cargo', () => {
  let service: Cargo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cargo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
