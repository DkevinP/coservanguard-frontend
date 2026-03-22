import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpAsignacionService } from './form-http-asignacion';

describe('FormHttpAsignacionService', () => {
  let service: FormHttpAsignacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [FormHttpAsignacionService] });
    service = TestBed.inject(FormHttpAsignacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar POST para crear asignación', () => {
    const data = { id_user: 1, id_puesto: 5 };

    service.crearAsignacion(data).subscribe();

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/asignacion/crear-asignacion');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });
});
