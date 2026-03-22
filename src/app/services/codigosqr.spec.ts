import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CodigoQrService, CodigoQR } from './codigosqr';

describe('CodigoQrService (HTTP)', () => {
  let service: CodigoQrService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CodigoQrService]
    });
    service = TestBed.inject(CodigoQrService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener la lista de códigos QR con imágenes', () => {
    const mockData: CodigoQR[] = [{
      id: 1, latitude: 0, longitude: 0, id_puesto: 5,
      extraField: 'base64image...' // Probando el [key: string]: any
    }];

    service.getCodigoQr().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/codigoqr/listar-codigo-img');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
