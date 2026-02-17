import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpSedeService } from './form-http-sede';

describe('FormHttpSedeService', () => {
  let service: FormHttpSedeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [FormHttpSedeService] });
    service = TestBed.inject(FormHttpSedeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar POST para crear sede', () => {
    const data = { sede: 'Sede Central', direccion: 'Calle 10' };
    service.crearSede(data).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/sede-cliente/crear-sede');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });
});
