import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../servicios/supabase';
import { confirmarClaveValidator } from '../../validators/clave.validator';
import { Usuario } from '../../modelos/usuario';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {
  
  // ---- Declaración del formulario reactivo ----
  miFormulario!: FormGroup;
  
  // ---- Variables de estado para la interfaz gráfica ----
  mostrarModal = false;
  mensajeModal = '';
  esError = false;
  cargando = false;

  constructor(
    private supabase: Supabase,
    private router: Router,
    private cdr: ChangeDetectorRef // ---- ChangeDetectorRef para forzar actualizaciones de pantalla ----
  ) {}

  ngOnInit(): void {
    // ---- Inicialización del formulario con sus validaciones sincrónicas ----
    this.miFormulario = new FormGroup({
      nombre: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      apellido: new FormControl("", [Validators.required]),
      edad: new FormControl("", [Validators.required, Validators.min(18), Validators.max(99)]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      clave: new FormControl("", [Validators.required, Validators.minLength(6)]),
      repiteClave: new FormControl("", [Validators.required])
    }, { validators: confirmarClaveValidator() }); // ---- Validador personalizado a nivel de grupo ----
  }

  // ---- Getters para acceder a los controles del formulario desde el HTML ----
  get nombre() { return this.miFormulario.get('nombre'); }
  get apellido() { return this.miFormulario.get('apellido'); }
  get edad() { return this.miFormulario.get('edad'); }
  get mail() { return this.miFormulario.get('mail'); }
  get clave() { return this.miFormulario.get('clave'); }
  get repiteClave() { return this.miFormulario.get('repiteClave'); }


// ---- Método principal para manejar el envío del formulario ----
  async enviarForm() {
    // ---- 1. Marca todos los campos como tocados para disparar los mensajes rojos si el usuario intenta enviar vacío ----
    this.miFormulario.markAllAsTouched();

    // ---- 2. Si el formulario tiene errores, cortamos la ejecución----
    if (this.miFormulario.invalid) {
      return;
    }

    // ---- 3. Activamos el spinner/texto de carga ----
    this.cargando = true;
    this.cdr.detectChanges(); 

    //  ---- Extraemos los valores listos para usar ----
    const nuevoUsuario: Usuario = {
      email: this.miFormulario.value.mail, // Emparejamos 'mail' del form con 'email' de la interfaz
      nombre: this.miFormulario.value.nombre,
      apellido: this.miFormulario.value.apellido,
      edad: this.miFormulario.value.edad,
      clave: this.miFormulario.value.clave
    };
    try {
      //  ----4. Llamada a Supabase.  ----
      const { data, error } = await this.supabase.registrar(nuevoUsuario.email, nuevoUsuario.clave);

      if (error) {
        // ---- Si el correo ya existe o ocurre un error de Auth ----
        const mensaje = error.message.includes('already registered') ? 'Este correo ya pertenece a un jugador registrado.' : 'Error al crear cuenta: ' + error.message;

        this.abrirModal(mensaje, true);
      } else if (data?.user) {
        // ---- 5. Registro exitoso en Auth: ahora guardamos los datos extra (nombre, edad) en la base de datos ----
        await this.supabase.guardarDatosUsuario(data.user.id, nuevoUsuario.email, nuevoUsuario.nombre, nuevoUsuario.apellido, nuevoUsuario.edad);
        
        //  ---- Limpiamos el formulario y avisamos del éxito ----
        this.miFormulario.reset();
        this.abrirModal('¡Jugador registrado con éxito! Bienvenido a la sala.', false);
      }
    } catch (err) {
      // ---- 6. El Catch atrapa errores de conexión graves ----
      this.abrirModal('Ocurrió un error inesperado de conexión.', true);
      console.error('Error crítico en el registro:', err);
    } finally {
      // ---- 7. El bloque FINALLY se ejecuta SIEMPRE al terminar, pase lo que pase. ----
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

// ---- Método para abrir el modal con un mensaje específico y un flag de error ----
  abrirModal(mensaje: string, error: boolean) {
    this.mensajeModal = mensaje;
    this.esError = error;
    this.mostrarModal = true;
    
    // ---- aseguramos que el estado de carga esté apagado ----
    this.cargando = false; 
    this.cdr.detectChanges(); 
  }

  cerrarModal() {
    this.mostrarModal = false;
    
    // ---- Si no fue un error, significa que se registró con éxito, lo enviamos al home ----
    if (!this.esError) {
      this.router.navigate(['/home']);
    }
  }
}