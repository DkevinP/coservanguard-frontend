import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asignacion {
  id_asignacion: number; 
  id_cc: number;
  id_puesto: number;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

    private apiUrl = 'http://localhost:8080/api/cliente/list-cliente'; 

  constructor(private http: HttpClient) { }

  getAsignacion(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.apiUrl);
  }
  
}