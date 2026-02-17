import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SedeCliente, SedeClienteService } from '../../services/sede-cliente';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpPuestoService } from '../../services/form-http-puesto';

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
    public dialogRef: MatDialogRef<FormCrearPuesto>,
    private sedeService: SedeClienteService,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpPuestoService
  ) {
    this.puestoForm = this.fb.group({
      puesto: ['', Validators.required],
      id_sede: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.sedeService.getSedeClientes().subscribe({
      next: (data) => {
        this.sedes = data;
        if (data && data.length > 0) {
          console.log('Datos del primer cliente:', data[0]);
          console.log('Tipo de dato de id_cliente:', typeof data[0].id);
        }
      },
      error: (error) => console.error('Error al cargar la lista de sedes:', error)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.puestoForm.valid) {
      const nuevapuesto = this.puestoForm.value;

      // Usamos el servicio
      this.formService.crearPuesto(nuevapuesto).subscribe({
        next: (response) => {
          this.dialogRef.close(nuevapuesto);
          this.abrirMensaje(true, 'Puesto creado con éxito.');
        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear el nuevo Puesto. Verifique los datos o intente más tarde.');
        }
      });
    }
  }

  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje }
    });
  }
}
