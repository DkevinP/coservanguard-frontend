import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: string; 
  nombre: number;
  apellido : number;
  telefono: Date;
  id_cargo: Date;

}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    private apiUrl = 'http://localhost:8080/api/usuario/list-usuario'; 

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
  
}