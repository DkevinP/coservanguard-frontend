import { Component, signal, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  public isExpanded = true;

  public usuarioActual: Usuario | null = null;
  public nombreCargo: string = 'SIN CARGO';

  constructor(
    public router: Router,
    private usuarioService: UsuarioService
  ) {
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
    if (!this.isLoginRoute()) {
      this.cargarDatosUsuario();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  // --- SOLUCIÓN PARA MÓVILES ---
  checkScreenSize() {
    this.isMobile = window.innerWidth < 900;

    // Si estamos en un celular, el menú SIEMPRE debe estar expandido (textos visibles)
    if (this.isMobile) {
      this.isExpanded = true;
    }
  }

  cargarDatosUsuario() {
    const cedula = localStorage.getItem('usuarioCedula');
    if (cedula) {
      this.usuarioService.getUsuarioByCedula(cedula).subscribe({
        next: (usuario: any) => {
          if(usuario) {
            this.usuarioActual = usuario;
            this.mapearCargo(usuario.id_cargo);
          }
        },
        error: (err: any) => {
          console.error(err);
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

  cerrarSesion() {
    localStorage.clear();
    this.usuarioActual = null;
    this.router.navigate(['/login']);
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  // Evitamos que el menú se vuelva "angosto" si estamos en un celular
  toggleSidenav() {
    if (!this.isMobile) {
      this.isExpanded = !this.isExpanded;
    }
  }
}
