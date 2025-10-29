import { TestBed } from '@angular/core/testing';

import { MarcacionQrDone } from './marcacion-qr-done';

describe('MarcacionQrDone', () => {
  let service: MarcacionQrDone;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarcacionQrDone);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
