import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CodigoQR {
  // Campos conocidos que usamos para la lógica
  id: number;
  // Quitamos 'qr: string;' porque no estamos seguros del nombre exacto del campo de imagen.
  latitude: number;
  longitude: number;
  id_puesto: number;
  puestoNombre?: string;

  // --- SOLUCIÓN ---
  // Esta línea mágica permite que el objeto tenga cualquier otra propiedad
  // adicional que venga del backend (como la imagen en base64),
  // sin importar cómo se llame el campo.
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CodigoQrService {

  // URL correcta que trae las imágenes
  private apiUrl = 'http://coservanguard.eastus.cloudapp.azure.com/api/codigoqr/listar-codigo-img';

  constructor(private http: HttpClient) { }

  getCodigoQr(): Observable<CodigoQR[]> {
    return this.http.get<CodigoQR[]>(this.apiUrl);
  }
}
