import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

// Imports necesarios para el Layout
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // <--- El truco mágico

describe('AppComponent', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [App],
      imports: [
        MatSidenavModule,
        BrowserAnimationsModule, // Necesario para evitar errores de animación del Sidenav
        RouterTestingModule      // Simula el ruteo sin cargar páginas reales
      ],
      // Esto evita que Angular se queje si no importamos el componente 'app-sidenav-menu'
      // Nos permite probar 'App' aisladamente.
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Título (Signals) ---
// --- PRUEBA 2: Título (Signals) ---
  it(`debería tener el título 'SedeClienteInterface'`, () => {
    // Usamos '(component as any)' para poder leer la variable protected
    expect((component as any).title()).toEqual('SedeClienteInterface');
  });

  // --- PRUEBA 3: Estructura del Layout ---
  it('debería contener el contenedor principal (Sidenav Container)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Buscamos la etiqueta de Material
    expect(compiled.querySelector('mat-sidenav-container')).toBeTruthy();
  });

  // --- PRUEBA 4: Ruteo ---
  it('debería tener un router-outlet para cargar las páginas', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Verificamos que existe el hueco donde se cargan las vistas
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
