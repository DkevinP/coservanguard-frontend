import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Puesto, PuestoService } from '../../services/puesto';

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
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearCodigoQr>,
    private puestoService: PuestoService
  ) {
    // Inicializamos el formulario con sus campos y validaciones
    this.codigoQrForm = this.fb.group({
      id_puesto: [null, Validators.required]
    });
  }

 ngOnInit(): void { 
    this.puestoService.getPuesto().subscribe({
      next: (data) => {
        this.puestos = data;

      },
      error: (error) => {
        console.error('Error al cargar la lista de puestos:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // Verificamos si el formulario es válido
    if (this.codigoQrForm.valid) {
      // Obtenemos el valor (ej: { id_puesto: 1 })
      const formValue = this.codigoQrForm.value;
      const apiUrl = 'http://localhost:8080/api/codigoqr/crear-codigoqr';

      // 1. Creamos los parámetros de la URL
      const params = new HttpParams().set('id_puesto', formValue.id_puesto.toString());

      // 2. Hacemos la petición POST enviando los 'params' y un 'null' en el body
      this.http.post(apiUrl, null, { params: params }).subscribe({
        next: (response) => {
          console.log('codigoQr creado con éxito:', response);
          this.dialogRef.close(formValue); 
        },
        error: (error) => {
          console.error('Error al crear el codigoQr:', error);
        }
      });
    }
  }

}
