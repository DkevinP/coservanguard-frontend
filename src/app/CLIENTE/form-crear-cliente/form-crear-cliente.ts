import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpClienteService } from '../../services/form-http-cliente';

@Component({
  selector: 'app-form-crear-cliente',
  standalone: false,
  templateUrl: './form-crear-cliente.html',
  styleUrl: './form-crear-cliente.scss'
})
export class FormCrearCliente implements OnInit {

  public clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearCliente>,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpClienteService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      nit: ['', [Validators.required, Validators.pattern('^[0-9]{1,11}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const nuevoCliente = this.clienteForm.value;

      // Usamos el servicio en lugar de http.post
      this.formService.crearCliente(nuevoCliente).subscribe({
        next: (response) => {
          this.dialogRef.close(nuevoCliente);
          this.abrirMensaje(true, 'Cliente creado con éxito.');
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
          this.abrirMensaje(false, 'Error al crear el cliente. Verifique los datos o intente más tarde.');
        }
      });
    } else {
      console.warn("El formulario no es válido. Revise los campos.");
    }
  }

  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje }
    });
  }
}
