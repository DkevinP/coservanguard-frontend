import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteInterface } from './CLIENTE/cliente-interface/cliente-interface';
import { SedeInterface } from './SEDES/sede-interface/sede-interface';
import { Usuarios } from './USUARIOS/usuario-interface/usuario';
import { TurnoInterface } from './TURNO/turnos-interface/turnos';
import { CargoInterface } from './USUARIOS/cargo-interface/cargo-interface';

const routes: Routes = [
  {path: 'clientes', component: ClienteInterface},
  {path: 'sedes', component: SedeInterface},
  {path: 'usuarios', component: Usuarios},
  {path: 'turnos', component: TurnoInterface},
  {path: 'cargos', component: CargoInterface}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
