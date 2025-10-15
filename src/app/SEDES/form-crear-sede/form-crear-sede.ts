import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Cliente, ClienteService } from '../../services/cliente';

@Component({
  selector: 'app-form-crear-sede',
  standalone: false,
  templateUrl: './form-crear-sede.html',
  styleUrl: './form-crear-sede.scss'
})
export class FormCrearSede {

   public sedeForm: FormGroup;
   public clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearSede>,
    private clienteService: ClienteService
  ) {
    // Inicializamos el formulario con sus campos y validaciones
    this.sedeForm = this.fb.group({
      sede: ['', Validators.required],
      direccion: ['', Validators.required],
      id_cliente: [null, Validators.required]
    });
  }

 ngOnInit(): void { 
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error al cargar la lista de clientes:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

    onSubmit(): void {
    // Verificamos si el formulario es válido
    if (this.sedeForm.valid) {
      const nuevaSede = this.sedeForm.value;
      const apiUrl = 'http://localhost:8080/api/sede-cliente/crear-sede';

      // Hacemos la petición POST al backend
      this.http.post(apiUrl, nuevaSede).subscribe({
        next: (response) => {
          console.log('Sede creado con éxito:', response);
          // Cerramos el diálogo y pasamos el nuevo cliente como resultado
          this.dialogRef.close(nuevaSede); 
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
         
        }
      });
    }
  }

}
