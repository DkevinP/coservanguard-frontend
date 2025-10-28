import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CodigoQR {
  id: number; 
  qr: string;
  latitude: number;
  longitude: number;
  id_puesto: number;
}

@Injectable({
  providedIn: 'root'
})
export class CodigoQrService {

    private apiUrl = 'http://localhost:8080/api/codigoqr/listar-codigo'; 

  constructor(private http: HttpClient) { }

  getCodigoQr(): Observable<CodigoQR[]> {
    return this.http.get<CodigoQR[]>(this.apiUrl);
  }
  
}