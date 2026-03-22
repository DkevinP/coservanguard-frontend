import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpPuestoService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com/api/puesto/crear-puesto';

  constructor(private http: HttpClient) { }

  crearPuesto(puesto: any): Observable<any> {
    return this.http.post(this.apiUrl, puesto);
  }
}
