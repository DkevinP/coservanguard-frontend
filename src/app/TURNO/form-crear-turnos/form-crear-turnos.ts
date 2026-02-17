import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Usuario, UsuarioService } from '../../services/usuarios';
import { Puesto, PuestoService } from '../../services/puesto';
import { MensajeDialogComponent } from '../../GENERAL_COMPONENTS/mensaje-dialog/mensaje-dialog';
// Importamos el nuevo servicio
import { FormHttpTurnoService } from '../../services/form-http-turno';

@Component({
  selector: 'app-form-crear-turno',
  standalone: false,
  templateUrl: './form-crear-turnos.html',
  styleUrl: './form-crear-turnos.scss'
})
export class FormCrearTurno implements OnInit {

  public turnoForm: FormGroup;
  public usuarios: Usuario[] = [];
  public puestos: Puesto[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormCrearTurno>,
    private usuarioService: UsuarioService,
    private puestoService: PuestoService,
    private dialog: MatDialog,
    // Inyectamos el servicio
    private formService: FormHttpTurnoService
  ) {
    this.turnoForm = this.fb.group({
      id_cc: [null, Validators.required],
      id_puesto: [null, Validators.required],
      startDate: new FormControl<Date | null>(null),
      startTime: new FormControl(''),
      endDate: new FormControl<Date | null>(null),
      endTime: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => console.error('Error al cargar la lista de clientes:', error)
    });

    this.puestoService.getPuesto().subscribe({
      next: (data) => this.puestos = data,
      error: (error) => console.error('Error al cargar la lista de clientes:', error)
    });

    this.turnoForm.valueChanges.subscribe(() => {
      console.log('Fecha y hora de inicio:', this.getCombinedStartDate());
      console.log('Fecha y hora de fin:', this.getCombinedEndDate());
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.turnoForm.valid) {

      const horaInicio = this.getCombinedStartDate();
      const horaFin = this.getCombinedEndDate();

      const turnoParaEnviar = {
        id_cc: this.turnoForm.value.id,
        id_puesto: this.turnoForm.value.id_puesto,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      };

      if (!turnoParaEnviar.hora_inicio || !turnoParaEnviar.hora_fin) {
        console.error('La fecha/hora de inicio o fin no es válida.');
        return;
      }

      // Usamos el servicio
      this.formService.crearTurno(turnoParaEnviar).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.abrirMensaje(true, 'Turno creado con éxito.');
        },
        error: (error) => {
          this.abrirMensaje(false, 'Error al crear el Turno. Verifique los datos o intente más tarde.');
        }
      });
    }
  }

  getCombinedStartDate(): Date | null {
    const date = this.turnoForm.value.startDate;
    const time = this.turnoForm.value.startTime; // Formato "HH:mm"

    if (!date || !time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    return combinedDate;
  }

  getCombinedEndDate(): Date | null {
    const date = this.turnoForm.value.endDate;
    const time = this.turnoForm.value.endTime;

    if (!date || !time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    return combinedDate;
  }

  abrirMensaje(esExito: boolean, mensaje: string): void {
    this.dialog.open(MensajeDialogComponent, {
      width: '350px',
      data: { esExito, mensaje }
    });
  }
}
