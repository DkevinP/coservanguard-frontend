import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Cliente, ClienteService } from '../../services/cliente';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';

@Component({
  selector: 'app-form-crear-sede',
  standalone: false,
  templateUrl: './form-crear-sede.html',
  styleUrl: './form-crear-sede.scss'
})
export class FormCrearSede implements OnInit{

   public sedeForm: FormGroup;
   public clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearSede>,
    private clienteService: ClienteService,
    private dialog: MatDialog 
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

        // 👇 === AÑADE ESTAS LÍNEAS PARA DIAGNOSTICAR === 👇
        if (data && data.length > 0) {
          console.log('Datos del primer cliente:', data[0]);
          console.log('Tipo de dato de id_cliente:', typeof data[0].id);
        }
        // ===================================================
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
          
          this.dialogRef.close(nuevaSede); 

          this.abrirMensaje(true, 'Sede creada con éxito.');
        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear la nueva sede. Verifique los datos o intente más tarde.');
         
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
