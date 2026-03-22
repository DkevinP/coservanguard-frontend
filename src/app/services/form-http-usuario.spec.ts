import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpUsuarioService } from './form-http-usuario';

describe('FormHttpUsuarioService', () => {
  let service: FormHttpUsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormHttpUsuarioService]
    });
    service = TestBed.inject(FormHttpUsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar una petición POST para crear un usuario', () => {
    const nuevoUsuario = {
      nombre: 'Maria',
      apellido: 'Gomez',
      cedula: '987654',
      correo: 'maria@test.com'
    };

    service.crearUsuario(nuevoUsuario).subscribe(respuesta => {
      expect(respuesta).toBeTruthy();
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/usuario/crear-usuario');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoUsuario);

    req.flush({ id: 1, ...nuevoUsuario });
  });
});
