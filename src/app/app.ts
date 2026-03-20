
import { Component, signal, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
// Asegúrate de ajustar la ruta correcta hacia tu servicio
import { UsuarioService, Usuario } from './services/usuarios';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Coservanguard');
  public isMobile = false;

  // Nuevas variables para almacenar los datos traídos de la BD
  public usuarioActual: Usuario | null = null;
  public nombreCargo: string = 'SIN CARGO';

  constructor(
    public router: Router,
    private usuarioService: UsuarioService
  ) {
    // Escuchar cambios de ruta: si entramos a la app desde el login, cargamos los datos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.isLoginRoute() && !this.usuarioActual) {
         this.cargarDatosUsuario();
      }
    });
  }

  ngOnInit() {
    this.checkScreenSize();
    // Si recargamos la página y ya estamos dentro de la app, cargar datos
    if (!this.isLoginRoute()) {
      this.cargarDatosUsuario();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 900;
  }

// --- NUEVA FUNCIÓN: Consulta a la base de datos ---
  cargarDatosUsuario() {
    const cedula = localStorage.getItem('usuarioCedula'); // Asegúrate de guardar esto en el login

    if (cedula) {
      this.usuarioService.getUsuarioByCedula(cedula).subscribe({
        // <-- SOLUCIÓN AL ERROR: Agregamos ": any" al usuario
        next: (usuario: any) => {
          if(usuario) {
            this.usuarioActual = usuario;
            this.mapearCargo(usuario.id_cargo);
          }
        },
        // <-- SOLUCIÓN AL ERROR: Agregamos ": any" al err
        error: (err: any) => {
          console.error('Error al cargar los datos del usuario:', err);
        }
      });
    }
  }

  mapearCargo(idCargo: number) {
    const cargosMap: {[key: number]: string} = {
      1: 'ADMINISTRADOR',
      2: 'SUPERVISOR',
      3: 'VIGILANTE',
      4: 'COORDINADOR'
    };
    this.nombreCargo = cargosMap[idCargo] || 'SIN CARGO';
  }

  // Función para borrar la sesión y salir
  cerrarSesion() {
    localStorage.clear();
    this.usuarioActual = null; // Limpiamos la variable en memoria
    this.router.navigate(['/login']);
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}
