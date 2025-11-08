import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

@Component({
  selector: 'app-form-crear-cargo',
  standalone: false,
  templateUrl: './form-crear-cargo.html',
  styleUrl: './form-crear-cargo.scss'
})
export class FormCrearCargo implements OnInit{

  public cargoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearCargo>,
    private dialog: MatDialog
  ) {
    // Inicializamos el formulario con sus campos y validaciones
    this.cargoForm = this.fb.group({
      nombre_cargo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

    onSubmit(): void {
    // Verificamos si el formulario es válido
    if (this.cargoForm.valid) {
      const nuevocargo = this.cargoForm.value;
      const apiUrl = 'http://localhost:8080/api/cargo/crear-cargo';

      // Hacemos la petición POST al backend
      this.http.post(apiUrl, nuevocargo).subscribe({
        next: (response) => {
          // Cerramos el diálogo y pasamos el nuevo cargo como resultado
          this.dialogRef.close(nuevocargo); 

          this.abrirMensaje(true, 'Cliente creado con éxito.');

        },
        error: (error) => {
        this.abrirMensaje(false, 'Error al crear el cliente. Verifique los datos o intente más tarde.');
          // Opcional: Mostrar un mensaje de error al usuario
        }
      });
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
