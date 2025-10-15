import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { App } from './app';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule} from '@angular/material/list';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
//Imports especiales para fecha y hora
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CommonModule } from '@angular/common';

import { SedeInterface } from './SEDES/sede-interface/sede-interface';
import { ClienteInterface } from './CLIENTE/cliente-interface/cliente-interface';
import { Usuarios } from './USUARIOS/usuario-interface/usuario';
import { TurnoInterface } from './TURNO/turnos-interface/turnos';

import { FormCrearCliente } from './CLIENTE/form-crear-cliente/form-crear-cliente';
import { FormCrearSede } from './SEDES/form-crear-sede/form-crear-sede';
import { FormCrearUsuario } from './USUARIOS/form-crear-usuario/form-crear-usuario';
import { FormCrearTurno } from './TURNO/form-crear-turnos/form-crear-turnos';

import { SidenavMenu } from './GENERAL_COMPONENTS/sidenav-menu/sidenav-menu';
import { Header } from './GENERAL_COMPONENTS/header/header';



@NgModule({
  declarations: [
    App,
    SedeInterface,
    ClienteInterface,
    FormCrearCliente,
    SidenavMenu,
    FormCrearSede,
    Header,
    Usuarios,
    FormCrearUsuario,
    FormCrearTurno,
    TurnoInterface
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
    
],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
