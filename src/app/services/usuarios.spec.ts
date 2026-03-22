import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService, Usuario } from './usuarios';

describe('UsuarioService (HTTP)', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de usuarios', () => {
    const mockUsuarios: Usuario[] = [{
      id: '123',
      nombre: 'Juan',
      apellido: 'Perez',
      telefono: '555',
      id_cargo: 1,
      cedula: '111',
      correo: 'juan@test.com'
    }];

    service.getUsuarios().subscribe(usuarios => {
      expect(usuarios.length).toBe(1);
      expect(usuarios).toEqual(mockUsuarios);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com/api/usuario/list-usuario');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
  });
});
