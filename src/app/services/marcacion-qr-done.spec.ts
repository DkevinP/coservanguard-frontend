import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MarcacionQrDoneService, MarcacionQrDone } from './marcacion-qr-done';

describe('MarcacionQrDoneService (HTTP)', () => {
  let service: MarcacionQrDoneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarcacionQrDoneService]
    });
    service = TestBed.inject(MarcacionQrDoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify(); });

  it('debería obtener el historial de marcaciones', () => {
    const mockData: MarcacionQrDone[] = [{
      id: 1,
      id_asignacion: 10,
      id_codigo: 5,
      fecha: new Date(),
      latitude: 4.0,
      longitude: -74.0,
      IdistanciaM: 10,
      Bes_cercano: true
    }];

    service.getMarcaciones().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://coservanguard.eastus.cloudapp.azure.com:8080/api/marcacionqr/list-marcacion');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
