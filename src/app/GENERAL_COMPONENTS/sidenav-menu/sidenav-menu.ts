import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  standalone: false,
  templateUrl: './sidenav-menu.html',
  styleUrl: './sidenav-menu.scss'
})
export class SidenavMenu {

  // Objeto para mantener el estado (abierto/cerrado) de cada menú
  public menuState: {[key: string]: boolean} = {
    usuarios: false,
    puntos: false
    // Puedes añadir más aquí si los necesitas en el futuro
  };

  constructor() { }

  // Función para cambiar el estado de un menú
  public toggleMenu(menuItem: string): void {
    // Guarda el estado actual del menú que se clickeó (true si estaba abierto)
    const wasOpen = this.menuState[menuItem];

    // Cierra todos los menús
    Object.keys(this.menuState).forEach(key => {
      this.menuState[key] = false;
    });

    // Si el menú NO estaba abierto, ábrelo.
    // Si ya estaba abierto, el paso anterior ya lo cerró.
    if (!wasOpen) {
      this.menuState[menuItem] = true;
    }
  }
}
