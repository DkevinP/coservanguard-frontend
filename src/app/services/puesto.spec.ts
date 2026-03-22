import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PuestoService, Puesto } from './puesto';

describe('PuestoService (HTTP)', () => {
  let service: PuestoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PuestoService]
    });
    service = TestBed.inject(PuestoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de puestos', () => {
    const mockPuestos: Puesto[] = [{ id: 1, puesto: 'Entrada Norte', id_sede: 2 }];

    service.getPuesto().subscribe(data => {
      expect(data).toEqual(mockPuestos);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/puesto/list-puesto');
    expect(req.request.method).toBe('GET');
    req.flush(mockPuestos);
  });
});
