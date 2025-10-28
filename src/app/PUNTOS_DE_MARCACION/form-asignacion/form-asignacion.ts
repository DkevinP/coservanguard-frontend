import { Component, OnInit } from '@angular/core'; // Añadido OnInit
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Usuario, UsuarioService } from '../../services/usuarios';
import { Puesto, PuestoService } from '../../services/puesto';

@Component({
  selector: 'app-form-crear-asignacion',
  standalone: false,
  templateUrl: './form-asignacion.html',
  styleUrl: './form-asignacion.scss'
})
// --- Añade OnInit a la clase ---
export class FormCrearAsignacion implements OnInit {

   public asignacionForm: FormGroup;
   public usuarios: Usuario[] = [];
   public puestos: Puesto[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormCrearAsignacion>,
    private usuarioService: UsuarioService,
    private puestoService: PuestoService
  ) {
    // Inicializamos el formulario SOLO con los campos necesarios
    this.asignacionForm = this.fb.group({
      id_user: [null, Validators.required],     
      id_puesto: [null, Validators.required]  
    });
  }

 ngOnInit(): void { 
    // Carga la lista de usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al cargar la lista de usuarios:', error);
      }
    });

    // Carga la lista de puestos
    this.puestoService.getPuesto().subscribe({
      next: (data) => {
        this.puestos = data;
      },
      error: (error) => {
        console.error('Error al cargar la lista de puestos:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

onSubmit(): void {
    console.log('Formulario válido:', this.asignacionForm.valid); 
    console.log('Valores del formulario:', this.asignacionForm.value); 
    console.log('Tipo de id_cc:', typeof this.asignacionForm.value.id_cc);
    console.log('Tipo de id_puesto:', typeof this.asignacionForm.value.id_puesto);

    if (this.asignacionForm.valid) {
      
      // --- ¡CORRECCIÓN! Envía el valor del formulario DIRECTAMENTE ---
      const datosParaEnviar = this.asignacionForm.value; 
      // Ya no creamos 'asignacionParaEnviar' ni hacemos conversiones manuales.
      // Los logs ya confirmaron que los tipos son 'number'.
      // -----------------------------------------------------------

      console.log('Enviando al backend:', datosParaEnviar); 

      const apiUrl = 'http://localhost:8080/api/asignacion/crear-asignacion';

      // --- Envía 'datosParaEnviar' (el valor directo del formulario) ---
      this.http.post(apiUrl, datosParaEnviar).subscribe({ 
        next: (response) => {
          console.log('Asignación creada con éxito:', response);
          this.dialogRef.close(response); 
        },
        error: (error) => {
          console.error('Error al crear la asignación:', error);
        }
      });
    } else {
      console.warn('Intento de envío con formulario inválido.'); 
    }
  }
}