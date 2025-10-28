// En codigo-qr.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-codigo-qr',
  standalone: false, 
  templateUrl: './codigo-qr.html',
  styleUrl: './codigo-qr.scss'
})
export class CodigoQr {

  // La variable data contendrá el objeto que le pasamos desde la tabla
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
   * Descargar el codigo QR
   */
  downloadQr(): void {
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + this.data.qr;
    link.download = `qr_puesto_${this.data.id_puesto}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}