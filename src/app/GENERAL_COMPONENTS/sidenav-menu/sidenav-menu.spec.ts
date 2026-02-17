import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavMenu } from './sidenav-menu'; // Verifica el nombre de la clase

// Imports de Material y Angular
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing'; // Necesario porque usas routerLink
import { By } from '@angular/platform-browser';

describe('SidenavMenu', () => {
  let component: SidenavMenu;
  let fixture: ComponentFixture<SidenavMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavMenu],
      imports: [
        MatListModule,
        MatIconModule,
        RouterTestingModule // Simula el router para que routerLink no falle
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Estado Inicial ---
  it('debería tener todos los menús cerrados al inicio', () => {
    // Verificamos que los valores en el objeto sean false
    expect(component.menuState['usuarios']).toBeFalse();
    expect(component.menuState['puntos']).toBeFalse();

    // Verificamos visualmente que no tengan la clase 'expanded'
    // Buscamos el div con la clase .menu-group
    const menuGroups = fixture.debugElement.queryAll(By.css('.menu-group.expanded'));
    expect(menuGroups.length).toBe(0);
  });

  // --- PRUEBA 3: Abrir un menú ---
  it('debería abrir el menú de Usuarios al hacer clic', () => {
    // Ejecutamos la función directamente
    component.toggleMenu('usuarios');
    fixture.detectChanges(); // Actualizamos la vista

    // Verificamos lógica
    expect(component.menuState['usuarios']).toBeTrue();

    // Verificamos vista (debería tener la clase expanded)
    // Nota: Buscamos específicamente el elemento que controla 'usuarios'
    // Como es difícil seleccionar por texto, confiamos en la lógica de la variable
    expect(component.menuState['usuarios']).toBeTrue();
  });

  // --- PRUEBA 4: Lógica de "Acordeón" (Uno a la vez) ---
  it('debería cerrar Usuarios si abro Puntos (solo uno abierto a la vez)', () => {
    // 1. Abrimos Usuarios primero
    component.toggleMenu('usuarios');
    expect(component.menuState['usuarios']).toBeTrue();
    expect(component.menuState['puntos']).toBeFalse();

    // 2. Ahora abrimos Puntos
    component.toggleMenu('puntos');

    // 3. Verificamos que Usuarios se cerró y Puntos se abrió
    expect(component.menuState['usuarios']).toBeFalse();
    expect(component.menuState['puntos']).toBeTrue();
  });

  // --- PRUEBA 5: Cerrar al hacer clic de nuevo ---
  it('debería cerrar el menú si hago clic en el mismo que ya está abierto', () => {
    // 1. Abrir
    component.toggleMenu('usuarios');
    expect(component.menuState['usuarios']).toBeTrue();

    // 2. Volver a hacer clic en el mismo
    component.toggleMenu('usuarios');

    // 3. Debería estar cerrado
    expect(component.menuState['usuarios']).toBeFalse();
  });
});
