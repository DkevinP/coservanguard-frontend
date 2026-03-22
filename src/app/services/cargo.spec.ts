import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CargoService, Cargo } from './cargo';

describe('CargoService (HTTP)', () => {
  let service: CargoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CargoService]
    });
    service = TestBed.inject(CargoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de cargos', () => {
    const mockData: Cargo[] = [{ id: 1, nombre_cargo: 'Jefe' }];

    service.getCargo().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com/api/cargo/list-cargo');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
