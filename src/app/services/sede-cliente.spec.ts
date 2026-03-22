import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SedeClienteService, SedeCliente } from './sede-cliente';

describe('SedeClienteService (HTTP)', () => {
  let service: SedeClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SedeClienteService]
    });
    service = TestBed.inject(SedeClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de sedes', () => {
    const mockSedes: SedeCliente[] = [
      { id: 1, sede: 'Principal', direccion: 123, id_cliente: 1 } // Nota: 'direccion' es number en tu interfaz actual
    ];

    service.getSedeClientes().subscribe(data => {
      expect(data).toEqual(mockSedes);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/sede-cliente/list-sede');
    expect(req.request.method).toBe('GET');
    req.flush(mockSedes);
  });
});
