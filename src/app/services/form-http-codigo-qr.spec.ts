import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormHttpCodigoQrService } from './form-http-codigo-qr';

describe('FormHttpCodigoQrService', () => {
  let service: FormHttpCodigoQrService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [FormHttpCodigoQrService] });
    service = TestBed.inject(FormHttpCodigoQrService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería enviar POST con HttpParams para crear QR', () => {
    const idPuesto = 55;

    service.crearCodigoQr(idPuesto).subscribe();

    // Verificamos la URL base
    const req = httpMock.expectOne(req => req.url === 'http://coservanguard.eastus.cloudapp.azure.com:8080/api/codigoqr/crear-codigoqr');
    expect(req.request.method).toBe('POST');

    // VERIFICACIÓN CLAVE: Que el parámetro viaje en la URL
    expect(req.request.params.get('id_puesto')).toBe('55');

    req.flush({});
  });
});
