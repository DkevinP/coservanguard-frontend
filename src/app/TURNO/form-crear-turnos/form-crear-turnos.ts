import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Usuario, UsuarioService } from '../../services/usuarios';
import { Puesto, PuestoService } from '../../services/puesto';

@Component({
  selector: 'app-form-crear-turno',
  standalone: false,
  templateUrl: './form-crear-turnos.html',
  styleUrl: './form-crear-turnos.scss'
})
export class FormCrearTurno {

   public turnoForm: FormGroup;
   public usuarios: Usuario[] = [];
   public puestos: Puesto[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearTurno>,
    private usuarioService: UsuarioService,
    private puestoService: PuestoService
  ) {
    // Inicializamos el formulario con sus campos y validaciones
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
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al cargar la lista de clientes:', error);
      }
    });

    this.puestoService.getPuesto().subscribe({
      next: (data) => {
        this.puestos = data;
      },
      error: (error) => {
        console.error('Error al cargar la lista de clientes:', error);
      }
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
      id_cc: this.turnoForm.value.id_cc,
      id_puesto: this.turnoForm.value.id_puesto,
      hora_inicio: horaInicio, // Usamos el valor combinado
      hora_fin: horaFin        // Usamos el valor combinado
    };

    if (!turnoParaEnviar.hora_inicio || !turnoParaEnviar.hora_fin) {
      console.error('La fecha/hora de inicio o fin no es válida.');
      // Aquí podrías mostrar un mensaje de error al usuario
      return;
    }

    const apiUrl = 'http://localhost:8080/api/turno-cliente/crear-turno';

    this.http.post(apiUrl, turnoParaEnviar).subscribe({
      next: (response) => {
        console.log('Turno creado con éxito:', response);
        this.dialogRef.close(response); 
      },
      error: (error) => {
        console.error('Error al crear el turno:', error);
      }
    });
  }

  }

  //funciones para ajustar la fecha y hora

  getCombinedStartDate(): Date | null {
    const date = this.turnoForm.value.startDate;
    const time = this.turnoForm.value.startTime; // Formato "HH:mm"

    if (!date || !time) {
      return null;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0); 

    return combinedDate;
  }

  getCombinedEndDate(): Date | null {
    const date = this.turnoForm.value.endDate;
    const time = this.turnoForm.value.endTime;

    if (!date || !time) {
      return null;
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    return combinedDate;
  }

}
