import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

// Interfaz para la respuesta real de tu backend (LoginResponseDTO)
interface LoginResponse {
  token: string;
  cedula: string;
  nombre: string;
  cargo: string;
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;
  public hidePassword = true;
  public isLoading = false;

  private loginSub: Subscription | null = null;

  // Endpoint definitivo de login
  private readonly API_URL = 'http://coservanguard.eastus.cloudapp.azure.com/api/usuario/login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    // AHORA PEDIMOS CÉDULA EN LUGAR DE EMAIL
    this.loginForm = this.fb.group({
      cedula: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { cedula, password } = this.loginForm.value;

      // Armamos el JSON exactamente como lo espera LoginRequestDTO en Java
      const body = {
        cedula: cedula.toString(), // Aseguramos que sea string
        contrasena: password
      };

      // Petición POST al backend
      this.loginSub = this.http.post<LoginResponse>(this.API_URL, body).subscribe({
        next: (response) => {

          // 1. VALIDAMOS QUE NO SEA VIGILANTE (Tu backend devuelve el cargo en MAYÚSCULAS)
          if (response.cargo.toUpperCase() === 'VIGILANTE') {
            this.mostrarError('Acceso denegado: Su rol no tiene permisos para acceder a la plataforma administrativa.');
            this.isLoading = false;
            return;
          }

          // 2. CONVERTIMOS EL TEXTO DEL CARGO A NÚMERO
          // Esto es vital para no romper la lógica de tu SidenavMenu que usa los números (1, 2, 4)
          const cargosMap: {[key: string]: string} = {
            'ADMINISTRADOR': '1',
            'SUPERVISOR': '2',
            'VIGILANTE': '3',
            'COORDINADOR': '4'
          };
          const idCargo = cargosMap[response.cargo.toUpperCase()] || '0';

          // 3. GUARDAMOS TODO EN LA SESIÓN (LOCALSTORAGE)
          localStorage.setItem('token', response.token);

          // ---> AQUÍ ESTÁ LA LÍNEA NUEVA QUE FALTABA <---
          localStorage.setItem('usuarioCedula', response.cedula);

          localStorage.setItem('usuarioNombre', response.nombre);
          localStorage.setItem('usuarioRol', idCargo);
          localStorage.setItem('usuarioEmail', `CC: ${response.cedula}`);

          // 4. REDIRIGIMOS AL INICIO
          this.router.navigate(['/inicio']);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error HTTP en el login:', err);

          // Tu backend devuelve un 401 si la contraseña o cédula están mal
          if (err.status === 401) {
            this.mostrarError('Cédula o contraseña incorrectos.');
          } else {
            this.mostrarError('Error de conexión con el servidor. Verifique que la API de Java esté encendida.');
          }
          this.isLoading = false;
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  mostrarError(mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito: false, mensaje }
    });
  }
}
