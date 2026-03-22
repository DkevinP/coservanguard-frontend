import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHttpSedeService {

  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com:8080/api/sede-cliente/crear-sede';

  constructor(private http: HttpClient) { }

  crearSede(sede: any): Observable<any> {
    return this.http.post(this.apiUrl, sede);
  }
}
