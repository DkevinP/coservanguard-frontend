import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpClienteService } from './form-http-cliente';

describe('FormHttpClienteService (Integration)', () => {
  let service: FormHttpClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormHttpClienteService]
    });
    service = TestBed.inject(FormHttpClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar un POST para crear cliente', () => {
    const nuevoCliente = { nombre: 'Test', nit: 123 };

    service.crearCliente(nuevoCliente).subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/cliente/crear-cliente');
    expect(req.request.method).toBe('POST');
    // Verificamos que el cuerpo de la petición sea exactamente lo que enviamos
    expect(req.request.body).toEqual(nuevoCliente);

    req.flush({ success: true });
  });
});
