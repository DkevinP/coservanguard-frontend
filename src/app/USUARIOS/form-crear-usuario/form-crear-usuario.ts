import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Cargo, CargoService } from '../../services/cargo';

@Component({
  selector: 'app-form-crear-usuario',
  standalone: false,
  templateUrl: './form-crear-usuario.html',
  styleUrl: './form-crear-usuario.scss'
})

export class FormCrearUsuario {

   public usuarioForm: FormGroup;
   public cargos: Cargo[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearUsuario>,
    private cargoServie: CargoService
  ) {
    // Inicializamos el formulario con sus campos y validaciones
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      contrasena: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      id_cargo: [null, Validators.required],
    });
  }

 ngOnInit(): void { 
    this.cargoServie.getCargo().subscribe({
      next: (data) => {
        this.cargos = data;
      },
      error: (error) => {
        console.error('Error al cargar la lista de usuarios:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

    onSubmit(): void {
    // Verificamos si el formulario es válido
    if (this.usuarioForm.valid) {
      const nuevausuario = this.usuarioForm.value;
      const apiUrl = 'http://localhost:8080/api/usuario/crear-usuario';

      // Hacemos la petición POST al backend
      this.http.post(apiUrl, nuevausuario).subscribe({
        next: (response) => {
          console.log('usuario creado con éxito:', response);
          // Cerramos el diálogo y pasamos el nuevo usuario como resultado
          this.dialogRef.close(nuevausuario); 
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
         
        }
      });
    }
  }

}
