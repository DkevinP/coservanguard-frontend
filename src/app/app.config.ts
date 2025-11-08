// Reemplaza todo tu archivo app.module.ts (o app.config.ts) con esto:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientModule } from '@angular/common/http';
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


// --- Tus Componentes ---
import { AppRoutingModule } from './app.routes'; // Asumo que se llama app.routes.ts
import { App } from './app';

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

import { GraficasMarcaciones } from './REPORTES/graficas-marcaciones/graficas-marcaciones';
import { BaseChartDirective } from 'ng2-charts';

import { SidenavMenu } from './GENERAL_COMPONENTS/sidenav-menu/sidenav-menu';
import { MensajeDialogComponent } from './GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';


@NgModule({
  declarations: [
    // Aquí van TODOS tus componentes
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
    MensajeDialogComponent
  ],
  imports: [
    // Aquí van TODOS los módulos
    BrowserModule,
    BrowserAnimationsModule, 
    HttpClientModule,        
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
    BaseChartDirective  
  ],
  providers: [
    // El array de providers debe estar VACÍO
  ],
  bootstrap: [App]
})
export class AppModule { }