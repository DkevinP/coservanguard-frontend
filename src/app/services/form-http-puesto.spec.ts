import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpPuestoService } from './form-http-puesto';

describe('FormHttpPuestoService', () => {
  let service: FormHttpPuestoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [FormHttpPuestoService] });
    service = TestBed.inject(FormHttpPuestoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar POST para crear puesto', () => {
    const data = { puesto: 'Puesto 1', id_sede: 10 };
    service.crearPuesto(data).subscribe();

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com/api/puesto/crear-puesto');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });
});
