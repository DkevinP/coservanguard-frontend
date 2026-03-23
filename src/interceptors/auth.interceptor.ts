import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    console.log("🚀 El interceptor se disparó para la URL:", request.url);

    // 1. Buscamos el token en el localStorage (Asegúrate de que se llame igual que en tu login)
    const token = localStorage.getItem('token');

    // 2. Si el token existe, clonamos la petición y le añadimos la cabecera
    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    // 3. Si no hay token, la petición sigue su curso normal
    return next.handle(request);
  }
}
