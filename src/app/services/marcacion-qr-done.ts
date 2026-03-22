import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarcacionQrDone {
    id: number;
    id_asignacion: number; // Asegúrate que sea number
    id_codigo: number;
    fecha: Date;
    latitude: number;
    longitude: number;
    IdistanciaM: number;
    Bes_cercano: boolean;
}

@Injectable({
  providedIn: 'root'
})
// CAMBIO AQUÍ: Antes decía "export class CodigoQrService"
export class MarcacionQrDoneService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com:8080/api/marcacionqr/list-marcacion';

  constructor(private http: HttpClient) { }

  getMarcaciones(): Observable<MarcacionQrDone[]> {
    return this.http.get<MarcacionQrDone[]>(this.apiUrl);
  }
}
