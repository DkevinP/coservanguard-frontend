import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Importa MatDialog
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

@Component({
  selector: 'app-form-crear-cliente',
  standalone: false,
  templateUrl: './form-crear-cliente.html',
  styleUrl: './form-crear-cliente.scss'
})
export class FormCrearCliente implements OnInit{

  public clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearCliente>,
    private dialog: MatDialog // Inyecta MatDialog para abrir el nuevo diálogo
  ) {
    // Inicializamos el formulario con validaciones más estrictas
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      // Valida que sean exactamente 7 dígitos numéricos
      nit: ['', [Validators.required, Validators.pattern('^[0-9]{7}$')]],
      // Valida que sean exactamente 10 dígitos numéricos
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
      const apiUrl = 'http://localhost:8080/api/cliente/crear-cliente';

      this.http.post(apiUrl, nuevoCliente).subscribe({
        next: (response) => {
          // Cierra el formulario actual
          this.dialogRef.close(nuevoCliente);
          // Abre el diálogo de éxito
          this.abrirMensaje(true, 'Cliente creado con éxito.');
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
          // MANTIENE el formulario abierto y muestra el diálogo de error
          this.abrirMensaje(false, 'Error al crear el cliente. Verifique los datos o intente más tarde.');
        }
      });
    } else {
      console.warn("El formulario no es válido. Revise los campos.");
    }
  }

  /**
   * Abre el nuevo diálogo de confirmación/error.
   * @param esExito true para éxito (verde), false para error (rojo)
   * @param mensaje El mensaje a mostrar
   */
  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje } // Pasa los datos al diálogo
    });
  }
}