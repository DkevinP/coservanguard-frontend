import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Cliente, ClienteService } from '../../services/cliente';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpSedeService } from '../../services/form-http-sede';

@Component({
  selector: 'app-form-crear-sede',
  standalone: false,
  templateUrl: './form-crear-sede.html',
  styleUrl: './form-crear-sede.scss'
})
export class FormCrearSede implements OnInit {

  public sedeForm: FormGroup;
  public clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearSede>,
    private clienteService: ClienteService,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpSedeService
  ) {
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
        if (data && data.length > 0) {
          console.log('Datos del primer cliente:', data[0]);
          console.log('Tipo de dato de id_cliente:', typeof data[0].id);
        }
      },
      error: (error) => console.error('Error al cargar la lista de clientes:', error)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.sedeForm.valid) {
      const nuevaSede = this.sedeForm.value;

      // Usamos el servicio
      this.formService.crearSede(nuevaSede).subscribe({
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

  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje }
    });
  }
}
