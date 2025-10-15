import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

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
    public dialogRef: MatDialogRef<FormCrearCliente>
  ) {
    // Inicializamos el formulario con sus campos y validaciones
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

    onSubmit(): void {
    // Verificamos si el formulario es válido
    if (this.clienteForm.valid) {
      const nuevoCliente = this.clienteForm.value;
      const apiUrl = 'http://localhost:8080/api/cliente/crear-cliente';

      // Hacemos la petición POST al backend
      this.http.post(apiUrl, nuevoCliente).subscribe({
        next: (response) => {
          console.log('Cliente creado con éxito:', response);
          // Cerramos el diálogo y pasamos el nuevo cliente como resultado
          this.dialogRef.close(nuevoCliente); 
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
          // Opcional: Mostrar un mensaje de error al usuario
        }
      });
    }
  }

}
