import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// 1. Actualizamos la interfaz para incluir los nuevos campos
export interface MensajeDialogData {
  mensaje: string;

  // Campos opcionales (?) para dar flexibilidad
  titulo?: string;
  esExito?: boolean; // Lo mantenemos por si quieres usarlo para colores (verde/rojo)
  tipoBoton?: 'unico' | 'confirmacion'; // Para saber si mostrar 1 o 2 botones
  textoBotonConfirmar?: string;
  textoBotonCancelar?: string;
}

@Component({
  selector: 'app-mensaje-dialog',
  templateUrl: './mensaje-dialog.html',
  styleUrls: ['./mensaje-dialog.scss'],
  standalone: false,// Asegúrate que este nombre coincida con tu archivo
})
export class MensajeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MensajeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MensajeDialogData
  ) {
    // 2. Lógica de seguridad (Defaults)
    // Si al llamar al diálogo no envían título, ponemos uno por defecto
    if (!this.data.titulo) {
      this.data.titulo = this.data.esExito ? 'Éxito' : 'Información';
    }

    // Si no especifican tipo de botón, asumimos que es 'unico' (solo Aceptar)
    if (!this.data.tipoBoton) {
      this.data.tipoBoton = 'unico';
    }
  }

  onCerrar(): void {
    this.dialogRef.close();
  }
}
