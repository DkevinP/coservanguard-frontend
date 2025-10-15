import { TestBed } from '@angular/core/testing';

import { Puesto } from './puesto';

describe('Puesto', () => {
  let service: Puesto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Puesto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
