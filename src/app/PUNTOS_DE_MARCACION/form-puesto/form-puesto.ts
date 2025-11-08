import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SedeCliente, SedeClienteService } from '../../services/sede-cliente';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

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
    private sedeService: SedeClienteService,
    private dialog: MatDialog
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

          this.dialogRef.close(nuevapuesto); 

          // Abre el diálogo de éxito
          this.abrirMensaje(true, 'Puesto creado con éxito.');

        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear el nuevo Puesto. Verifique los datos o intente más tarde.');
         
        }
      });
    }
  }

  /**
   * Abre el nuevo diálogo de confirmación/error.
   * @param esExito true para éxito (verde), false para error (rojo)
   * @param mensaje El mensaje a mostrar
   */
  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje } // Pasa los datos al diálogo
    });
  }


}
