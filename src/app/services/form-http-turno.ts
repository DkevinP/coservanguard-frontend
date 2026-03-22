import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpTurnoService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com/api/turno-cliente/crear-turno';

  constructor(private http: HttpClient) { }

  crearTurno(turno: any): Observable<any> {
    return this.http.post(this.apiUrl, turno);
  }
}
