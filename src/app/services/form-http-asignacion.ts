import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpAsignacionService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com/api/asignacion/crear-asignacion';

  constructor(private http: HttpClient) { }

  crearAsignacion(asignacion: any): Observable<any> {
    return this.http.post(this.apiUrl, asignacion);
  }
}
