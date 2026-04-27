import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  standalone: false,
  templateUrl: './sidenav-menu.html',
  styleUrl: './sidenav-menu.scss'
})
export class SidenavMenu implements OnInit {

  // --- VARIABLES DE CONEXIÓN CON APP.HTML ---
  @Input() isExpanded: boolean = true;
  @Output() toggleExpanded = new EventEmitter<void>();
  @Output() closeSidenav = new EventEmitter<void>();

  public menuState: {[key: string]: boolean} = {
    usuarios: false,
    turnos: false,
    puntos: false
  };

  public userRole: number = 0;

  constructor() { }

  ngOnInit() {
    const rolGuardado = localStorage.getItem('usuarioRol');
    this.userRole = rolGuardado ? parseInt(rolGuardado, 10) : 0;
  }

  public toggleMenu(menuItem: string): void {
    // Si el menú está contraído y el usuario hace clic en un grupo, expandimos el menú primero
    if (!this.isExpanded) {
      this.toggleExpanded.emit();
    }

    const wasOpen = this.menuState[menuItem];

    Object.keys(this.menuState).forEach(key => {
      this.menuState[key] = false;
    });

    if (!wasOpen) {
      this.menuState[menuItem] = true;
    }
  }

  // Método para emitir el evento de cierre (útil para móviles)
  public onMenuClick() {
    this.closeSidenav.emit();
  }
}
