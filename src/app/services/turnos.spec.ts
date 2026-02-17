import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnoService, Turno } from './turnos';

describe('TurnoService (HTTP)', () => {
  let service: TurnoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TurnoService]
    });
    service = TestBed.inject(TurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de turnos', () => {
    const mockTurnos: Turno[] = [{
      id: 1,
      id_cc: 123,
      id_puesto: 45,
      hora_inicio: '08:00',
      hora_fin: '17:00'
    }];

    service.getTurnos().subscribe(data => {
      expect(data).toEqual(mockTurnos);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/turno/list-turno');
    expect(req.request.method).toBe('GET');
    req.flush(mockTurnos);
  });
});
