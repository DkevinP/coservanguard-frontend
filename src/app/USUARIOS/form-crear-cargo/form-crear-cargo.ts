import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpCargoService } from '../../services/form-http-cargo';

@Component({
  selector: 'app-form-crear-cargo',
  standalone: false,
  templateUrl: './form-crear-cargo.html',
  styleUrl: './form-crear-cargo.scss'
})
export class FormCrearCargo implements OnInit {

  public cargoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearCargo>,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpCargoService
  ) {
    this.cargoForm = this.fb.group({
      nombre_cargo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.cargoForm.valid) {
      const nuevocargo = this.cargoForm.value;

      // Usamos el servicio
      this.formService.crearCargo(nuevocargo).subscribe({
        next: (response) => {
          this.dialogRef.close(nuevocargo);
          this.abrirMensaje(true, 'Cargo creado con éxito.'); // Corregido texto "Cliente" -> "Cargo"
        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear el cargo. Verifique los datos o intente más tarde.');
        }
      });
    }
  }

  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje }
    });
  }
}
