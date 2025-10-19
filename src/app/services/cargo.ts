import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cargo {
  id_cargo: number; 
  nombre_cargo: string;
}

@Injectable({
  providedIn: 'root'
})
export class CargoService {

    private apiUrl = 'http://localhost:8080/api/cargo/list-cargo'; 

  constructor(private http: HttpClient) { }

  getCargo(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.apiUrl);
  }
  
}