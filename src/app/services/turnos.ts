import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Turno {
  id: number;
  id_cc: number;      // ID del usuario (Cédula o ID interno)
  id_puesto: number;  // ID del puesto
  hora_inicio: string;
  hora_fin: string;
  // Campos opcionales para la vista
  usuarioNombre?: string;
  puestoNombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com:8080/api/turno/list-turno';

  constructor(private http: HttpClient) { }

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }
}
