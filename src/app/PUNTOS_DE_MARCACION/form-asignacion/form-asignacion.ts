import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Usuario, UsuarioService } from '../../services/usuarios';
import { Puesto, PuestoService } from '../../services/puesto';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpAsignacionService } from '../../services/form-http-asignacion';

@Component({
  selector: 'app-form-crear-asignacion',
  standalone: false,
  templateUrl: './form-asignacion.html',
  styleUrl: './form-asignacion.scss'
})
export class FormCrearAsignacion implements OnInit {

  public asignacionForm: FormGroup;
  public usuarios: Usuario[] = [];
  public puestos: Puesto[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearAsignacion>,
    private usuarioService: UsuarioService,
    private puestoService: PuestoService,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpAsignacionService
  ) {
    this.asignacionForm = this.fb.group({
      id_user: [null, Validators.required],
      id_puesto: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => console.error('Error al cargar la lista de usuarios:', error)
    });

    this.puestoService.getPuesto().subscribe({
      next: (data) => this.puestos = data,
      error: (error) => console.error('Error al cargar la lista de puestos:', error)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.asignacionForm.valid) {
      const datosParaEnviar = this.asignacionForm.value;

      // Usamos el servicio
      this.formService.crearAsignacion(datosParaEnviar).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.abrirMensaje(true, 'Puesto asignado correctamente.');
        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear la nueva asignación.');
        }
      });
    } else {
      console.warn('Intento de envío con formulario inválido.');
    }
  }

  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje }
    });
  }
}
