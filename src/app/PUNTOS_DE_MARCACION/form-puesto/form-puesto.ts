import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { SedeCliente, SedeClienteService } from '../../services/sede-cliente';

@Component({
  selector: 'app-form-crear-puesto',
  standalone: false,
  templateUrl: './form-puesto.html',
  styleUrl: './form-puesto.scss'
})
export class FormCrearPuesto {

   public puestoForm: FormGroup;
   public sedes: SedeCliente[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearPuesto>,
    private sedeService: SedeClienteService
  ) {
    // Inicializamos el formulario con sus campos y validaciones
    this.puestoForm = this.fb.group({
      puesto: ['', Validators.required],
      id_sede: ['', Validators.required]
    });
  }

 ngOnInit(): void { 
    this.sedeService.getSedeClientes().subscribe({
      next: (data) => {
        this.sedes = data;

        // 👇 === AÑADE ESTAS LÍNEAS PARA DIAGNOSTICAR === 👇
        if (data && data.length > 0) {
          console.log('Datos del primer cliente:', data[0]);
          console.log('Tipo de dato de id_cliente:', typeof data[0].id);
        }
        // ===================================================


      },
      error: (error) => {
        console.error('Error al cargar la lista de sedes:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

    onSubmit(): void {
    // Verificamos si el formulario es válido
    if (this.puestoForm.valid) {
      const nuevapuesto = this.puestoForm.value;
      const apiUrl = 'http://localhost:8080/api/puesto/crear-puesto';

      // Hacemos la petición POST al backend
      this.http.post(apiUrl, nuevapuesto).subscribe({
        next: (response) => {
          console.log('puesto creado con éxito:', response);
          // Cerramos el diálogo y pasamos el nuevo sede como resultado
          this.dialogRef.close(nuevapuesto); 
        },
        error: (error) => {
          console.error('Error al crear el sede:', error);
         
        }
      });
    }
  }

}
