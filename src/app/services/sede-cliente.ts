import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SedeCliente {
  id: number; 
  sede: string;
  direccion: number;
  id_cliente: number;
}

@Injectable({
  providedIn: 'root'
})
export class SedeClienteService {

    private apiUrl = 'http://localhost:8080/api/sede-cliente/list-sede'; 

  constructor(private http: HttpClient) { }

  getSedeClientes(): Observable<SedeCliente[]> {
    return this.http.get<SedeCliente[]>(this.apiUrl);
  }
  
}