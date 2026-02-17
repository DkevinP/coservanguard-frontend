import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpClienteService {

  private apiUrl = 'http://localhost:8080/api/cliente/crear-cliente';

  constructor(private http: HttpClient) { }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }
}
