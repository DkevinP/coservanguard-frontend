import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Cargo, CargoService } from '../../services/cargo';
// Importamos el nuevo servicio
import { FormHttpUsuarioService } from '../../services/form-http-usuario';

@Component({
  selector: 'app-form-crear-usuario',
  standalone: false,
  templateUrl: './form-crear-usuario.html',
  styleUrl: './form-crear-usuario.scss'
})
export class FormCrearUsuario implements OnInit {

  public usuarioForm: FormGroup;
  public cargos: Cargo[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearUsuario>,
    private cargoServie: CargoService,
    // Inyectamos el servicio
    private formService: FormHttpUsuarioService
  ) {
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
      next: (data) => this.cargos = data,
      error: (error) => console.error('Error al cargar la lista de cargos:', error)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const nuevausuario = this.usuarioForm.value;

      // Usamos el servicio
      this.formService.crearUsuario(nuevausuario).subscribe({
        next: (response) => {
          console.log('usuario creado con éxito:', response);
          this.dialogRef.close(nuevausuario);
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
        }
      });
    }
  }
}
