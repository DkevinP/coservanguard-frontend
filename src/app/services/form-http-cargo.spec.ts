import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpCargoService } from './form-http-cargo';

describe('FormHttpCargoService', () => {
  let service: FormHttpCargoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [FormHttpCargoService] });
    service = TestBed.inject(FormHttpCargoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar POST para crear cargo', () => {
    const data = { nombre_cargo: 'Admin' };

    service.crearCargo(data).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/cargo/crear-cargo');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });
});
