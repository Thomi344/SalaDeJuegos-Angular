import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  
  miFormulario!: FormGroup;
  
  mostrarModal = false;
  mensajeModal = '';
  esError = false;
  cargando = false;

  constructor(
    private supabase: Supabase,
    private router: Router,
    // ---- ChangeDetectorRef nos permite forzar la actualización de la vista en momentos específicos (como mostrar el "CONECTANDO...") ----
    private cdr: ChangeDetectorRef,
    // ---- NgZone sirve para que los cambios en el DOM se reflejen correctamente, realiza el cambio de contexto  ----
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.miFormulario = new FormGroup({
      mail: new FormControl('', [Validators.required, Validators.email]),
      clave: new FormControl('', [Validators.required])
    });
  }

  get mail() { return this.miFormulario.get('mail'); }
  get clave() { return this.miFormulario.get('clave'); }

  // --- MÉTODO DE ACCESO RÁPIDO ---
  loginRapido(correo: string, clave: string) {
    // ---- Rellenamos el formulario automáticamente ----
    this.miFormulario.patchValue({
      mail: correo,
      clave: clave
    });
    // ---- Disparar el envío ----
    //this.enviarForm();
  }

  async enviarForm() {
    this.miFormulario.markAllAsTouched();

    if (this.miFormulario.invalid) {
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    const { mail, clave } = this.miFormulario.value;

    // ---- Intentamos iniciar sesión con Supabase ----
    const { data, error } = await this.supabase.iniciarSesion(mail, clave);

    this.ngZone.run(() => {
      this.cargando = false;

      if (error) {
        this.abrirModal('Credenciales incorrectas o usuario inexistente.', true);
      } else if (data?.user) {
        this.abrirModal('¡Acceso concedido! Preparando la sala...', false);
      }
    });
  }

  // --- CONTROL DEL MODAL ---
  abrirModal(mensaje: string, error: boolean) {
    this.mensajeModal = mensaje;
    this.esError = error;
    this.mostrarModal = true;
    
    this.cdr.detectChanges(); 
  }

  cerrarModal() {
    this.mostrarModal = false;
    
    if (!this.esError) {
      this.router.navigate(['/home']);
    }
  }
}