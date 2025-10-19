import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Puesto {
  id_puesto: number; 
  puesto: string;
  id_sede: number;
}

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

    private apiUrl = 'http://localhost:8080/api/puesto/list-puesto'; 

  constructor(private http: HttpClient) { }

  getPuesto(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(this.apiUrl);
  }
  
}