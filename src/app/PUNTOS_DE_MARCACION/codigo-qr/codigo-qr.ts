// En codigo-qr.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-codigo-qr',
  // Hacemos este componente standalone para que sea más fácil
  standalone: false, 
  // Importamos los módulos que necesita este componente
  templateUrl: './codigo-qr.html',
  styleUrl: './codigo-qr.scss'
})
export class CodigoQr {

  // La variable 'data' contendrá el objeto que le pasamos desde la tabla
  constructor(
    public dialogRef: MatDialogRef<CodigoQr>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  /**
   * Cierra el diálogo
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Crea un enlace temporal y lo "clickea" para descargar
   * la imagen Base64 como un archivo .png
   */
  downloadQr(): void {
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + this.data.qr;
    link.download = `qr_puesto_${this.data.id_puesto}.png`; // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}