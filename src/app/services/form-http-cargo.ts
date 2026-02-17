import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpCargoService {

  private apiUrl = 'http://localhost:8080/api/cargo/crear-cargo';

  constructor(private http: HttpClient) { }

  crearCargo(cargo: any): Observable<any> {
    return this.http.post(this.apiUrl, cargo);
  }
}
