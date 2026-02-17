import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpCodigoQrService {

  private apiUrl = 'http://localhost:8080/api/codigoqr/crear-codigoqr';

  constructor(private http: HttpClient) { }

  // Recibimos el ID y el servicio se encarga de armar los params
  crearCodigoQr(idPuesto: number): Observable<any> {
    const params = new HttpParams().set('id_puesto', idPuesto.toString());
    return this.http.post(this.apiUrl, null, { params });
  }
}
