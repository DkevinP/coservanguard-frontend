import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Esta interfaz define la estructura de los datos que esperamos recibir
export interface MensajeDialogData {
  esExito: boolean;
  mensaje: string;
}

@Component({
  selector: 'app-mensaje-dialog',
  standalone: false,
  templateUrl: './mensaje-dialog.html',
  styleUrls: ['./mensaje-dialog.scss']
})
export class MensajeDialogComponent {

  // Hacemos públicos los datos inyectados para usarlos fácilmente en el template
  constructor(
    public dialogRef: MatDialogRef<MensajeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MensajeDialogData
  ) {}

  /** Cierra el diálogo al hacer clic en el botón */
  onCerrar(): void {
    this.dialogRef.close();
  }
}