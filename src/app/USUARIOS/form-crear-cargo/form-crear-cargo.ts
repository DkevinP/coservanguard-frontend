import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

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
    public dialogRef: MatDialogRef<FormCrearCargo>
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
          console.log('cargo creado con éxito:', response);
          // Cerramos el diálogo y pasamos el nuevo cargo como resultado
          this.dialogRef.close(nuevocargo); 
        },
        error: (error) => {
          console.error('Error al crear el cargo:', error);
          // Opcional: Mostrar un mensaje de error al usuario
        }
      });
    }
  }

}
