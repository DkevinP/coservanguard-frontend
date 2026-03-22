import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AsignacionService, Asignacion } from './asignacion';

describe('AsignacionService (HTTP)', () => {
  let service: AsignacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AsignacionService]
    });
    service = TestBed.inject(AsignacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de asignaciones', () => {
    const mockData: Asignacion[] = [{ id: 1, id_user: 'user1', id_puesto: 10 }];

    service.getAsignacion().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com/api/asignacion/list-asignacion');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
