import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- IMPORTANTE: Necesario para filtrar

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  id_cargo: number;
  cedula: string;
  correo: string;
  cargoNombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com:8080/api/usuario/list-usuario';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // <-- NUEVO MÉTODO: Trae la lista y filtra por la cédula
  getUsuarioByCedula(cedula: string): Observable<Usuario | undefined> {
    return this.getUsuarios().pipe(
      map(usuarios => usuarios.find(usuario => usuario.cedula === cedula))
    );
  }
}
