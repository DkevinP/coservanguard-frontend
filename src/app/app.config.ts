import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Importamos el HttpClientModule y el token para interceptores
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// --- Módulos de Angular Material ---
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatListModule} from '@angular/material/list';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

// --- Importación de tu Interceptor ---
import { AuthInterceptor } from '../interceptors/auth.interceptor'; // <-- Verifica que esta ruta sea correcta

// --- Tus Componentes ---
import { AppRoutingModule } from './app.routes';
import { App } from './app';
import { LayoutModule } from '@angular/cdk/layout'; // ¡Esta es la clave para el BreakpointObserver!

import { SedeInterface } from './SEDES/sede-interface/sede-interface';
import { FormCrearSede } from './SEDES/form-crear-sede/form-crear-sede';

import { ClienteInterface } from './CLIENTE/cliente-interface/cliente-interface';
import { FormCrearCliente } from './CLIENTE/form-crear-cliente/form-crear-cliente';

import { Usuarios } from './USUARIOS/usuario-interface/usuario';
import { FormCrearUsuario } from './USUARIOS/form-crear-usuario/form-crear-usuario';
import { CargoInterface } from './USUARIOS/cargo-interface/cargo-interface';
import { FormCrearCargo } from './USUARIOS/form-crear-cargo/form-crear-cargo';

import { TurnoInterface } from './TURNO/turnos-interface/turnos';
import { FormCrearTurno } from './TURNO/form-crear-turnos/form-crear-turnos';

import { FormCrearCodigoQr } from './PUNTOS_DE_MARCACION/form-codigo-qr/form-codigo-qr';
import { CodigoQrInterface } from './PUNTOS_DE_MARCACION/codigo-qr-interface/codigo-qr-interface';
import { CodigoQr } from './PUNTOS_DE_MARCACION/codigo-qr/codigo-qr';
import { PuestoInterface } from './PUNTOS_DE_MARCACION/puesto-interface/puesto-interface';
import { FormCrearPuesto } from './PUNTOS_DE_MARCACION/form-puesto/form-puesto';
import { asignacionInterface } from './PUNTOS_DE_MARCACION/asignacion-interface/asignacion-interface';
import { FormCrearAsignacion } from './PUNTOS_DE_MARCACION/form-asignacion/form-asignacion';
import { marcacionQrRealizadaInterface } from './PUNTOS_DE_MARCACION/marcaciones-qr-realizadas/marcaciones-qr-realizadas';
import { MapaPuntosComponent } from './PUNTOS_DE_MARCACION/mapa-puntos/mapa-puntos';
import { MarcacionDetalleDialogComponent } from './PUNTOS_DE_MARCACION/marcacion-detalle/marcacion-detalle';

import { GraficasMarcaciones } from './REPORTES/graficas-marcaciones/graficas-marcaciones';
import { BaseChartDirective } from 'ng2-charts';

import { SidenavMenu } from './GENERAL_COMPONENTS/sidenav-menu/sidenav-menu';
import { MensajeDialogComponent } from './GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

import { LoginComponent } from './AUTH/login/login';
import { InicioComponent } from './HOME/inicio/inicio';

@NgModule({
  declarations: [
    App,
    SedeInterface,
    ClienteInterface,
    FormCrearCliente,
    SidenavMenu,
    FormCrearSede,
    Usuarios,
    FormCrearUsuario,
    FormCrearTurno,
    TurnoInterface,
    CargoInterface,
    FormCrearCargo,
    PuestoInterface,
    FormCrearPuesto,
    FormCrearCodigoQr,
    CodigoQrInterface,
    CodigoQr,
    asignacionInterface,
    FormCrearAsignacion,
    marcacionQrRealizadaInterface,
    GraficasMarcaciones,
    MensajeDialogComponent,
    LoginComponent,
    InicioComponent,
    MapaPuntosComponent,
    MarcacionDetalleDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    ReactiveFormsModule,
    AppRoutingModule,

    // Módulos de Angular Material
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BaseChartDirective,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    LayoutModule
  ],
  providers: [
      // 1. LE DECIMOS A ANGULAR QUE USE EL CLIENTE HTTP MODERNO Y ESCUCHE A LOS INTERCEPTORES
      provideHttpClient(withInterceptorsFromDi()),

      // 2. MANTENEMOS TU INTERCEPTOR EXACTAMENTE COMO LO TENÍAS
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
    ],
    bootstrap: [App]
  })
export class AppModule { }
