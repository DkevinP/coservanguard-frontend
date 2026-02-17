import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Puesto, PuestoService } from '../../services/puesto';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpCodigoQrService } from '../../services/form-http-codigo-qr';

@Component({
  selector: 'app-form-crear-codigoQr',
  standalone: false,
  templateUrl: './form-codigo-qr.html',
  styleUrl: './form-codigo-qr.scss'
})
export class FormCrearCodigoQr {

  public codigoQrForm: FormGroup;
  public puestos: Puesto[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearCodigoQr>,
    private puestoService: PuestoService,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpCodigoQrService
  ) {
    this.codigoQrForm = this.fb.group({
      id_puesto: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.puestoService.getPuesto().subscribe({
      next: (data) => this.puestos = data,
      error: (error) => console.error('Error al cargar la lista de puestos:', error)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.codigoQrForm.valid) {
      const formValue = this.codigoQrForm.value;

      // El servicio se encarga de los HttpParams, solo enviamos el ID
      this.formService.crearCodigoQr(formValue.id_puesto).subscribe({
        next: (response) => {
          this.dialogRef.close(formValue);
          this.abrirMensaje(true, 'Codigo QR creado con éxito.');
        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear el codigo QR. Verifique los datos o intente más tarde.');
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
