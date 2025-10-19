import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TurnoCliente {
  id_Turno: string; 
  id_cc: number;
  id_puesto : number;
  hora_inicio: Date;
  hora_fi: Date;

}

@Injectable({
  providedIn: 'root'
})
export class TurnoClienteService {

    private apiUrl = 'http://localhost:8080/api/turno/list-turnos'; 

  constructor(private http: HttpClient) { }

  getTurnos(): Observable<TurnoCliente[]> {
    return this.http.get<TurnoCliente[]>(this.apiUrl);
  }
  
}