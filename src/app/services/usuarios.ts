import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  // Ajusta 'id' a number o string según lo que realmente devuelva tu backend (parece ser string/cédula)
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  id_cargo: number; // Corregido: Era 'Date', debe ser 'number' para cruzar con Cargo

  // Campos que usa tu tabla pero faltaban en la interfaz
  cedula: string;
  correo: string;

  // Campo opcional para mostrar el nombre del cargo en la tabla
  cargoNombre?: string;
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
