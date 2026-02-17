import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpTurnoService } from './form-http-turno';

describe('FormHttpTurnoService', () => {
  let service: FormHttpTurnoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormHttpTurnoService]
    });
    service = TestBed.inject(FormHttpTurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar una petición POST para crear un turno', () => {
    const nuevoTurno = {
      id_cc: 101,
      id_puesto: 202,
      hora_inicio: new Date(),
      hora_fin: new Date()
    };

    service.crearTurno(nuevoTurno).subscribe(respuesta => {
      expect(respuesta).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/turno-cliente/crear-turno');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoTurno);

    req.flush({ success: true });
  });
});
