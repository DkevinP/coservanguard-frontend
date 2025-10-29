import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarcacionQrDone {
    id: number,

    id_asignacion: string,

    id_codigo: number,

    fecha: Date,


    latitude: number,


    longitude: number,

    IdistanciaM: number,

    Bes_cercano: Boolean,
}

@Injectable({
  providedIn: 'root'
})
export class CodigoQrService {

    private apiUrl = 'http://localhost:8080/api/marcacionqr/list-marcacion'; 

  constructor(private http: HttpClient) { }

  getCodigoQr(): Observable<MarcacionQrDone[]> {
    return this.http.get<MarcacionQrDone[]>(this.apiUrl);
  }
  
}