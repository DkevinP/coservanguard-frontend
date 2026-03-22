import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService, Cliente } from './cliente';

describe('ClienteService (HTTP)', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones pendientes
  });

  it('debería hacer una petición GET a la API correcta', () => {
    const mockClientes: Cliente[] = [
      { id: 1, nombre: 'Empresa A', nit: 123, telefono: 555, email: 'a@a.com' }
    ];

    service.getClientes().subscribe(clientes => {
      expect(clientes.length).toBe(1);
      expect(clientes).toEqual(mockClientes);
    });

    // 1. Verificamos la URL y el método
    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/cliente/list-cliente');
    expect(req.request.method).toBe('GET');

    // 2. Simulamos la respuesta de la API Java
    req.flush(mockClientes);
  });
});
