import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  standalone: false,
  templateUrl: './sidenav-menu.html',
  styleUrl: './sidenav-menu.scss'
})
export class SidenavMenu implements OnInit {

  // Objeto para mantener el estado (abierto/cerrado) de cada menú
  public menuState: {[key: string]: boolean} = {
    usuarios: false,
    turnos: false,
    puntos: false
  };

  // Variable para almacenar el rol del usuario actual
  public userRole: number = 0;

  constructor() { }

  ngOnInit() {
    // Leemos el rol guardado durante el login en el localStorage
    const rolGuardado = localStorage.getItem('usuarioRol');

    // Lo convertimos a número. Si no existe, se asigna 0 por seguridad.
    this.userRole = rolGuardado ? parseInt(rolGuardado, 10) : 0;
  }

  // Función para cambiar el estado de un menú (Acordeón)
  public toggleMenu(menuItem: string): void {
    const wasOpen = this.menuState[menuItem];

    // Cierra todos los menús
    Object.keys(this.menuState).forEach(key => {
      this.menuState[key] = false;
    });

    // Si el menú NO estaba abierto, ábrelo.
    if (!wasOpen) {
      this.menuState[menuItem] = true;
    }
  }
}
