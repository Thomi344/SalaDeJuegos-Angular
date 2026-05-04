import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Supabase } from '../../servicios/supabase';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  
  usuarioLogueado: any = null;
  correoUsuario: string = '';

  constructor(
    private router: Router,
    private supabase: Supabase,
    // ---- NgZone sirve para que los cambios en el DOM se reflejen correctamente, realiza el cambio de contexto  ----
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    // ---- Apenas carga el Home, consulta a Supabase si hay una sesión activa ----
    const { data: { session } } = await this.supabase.clienteSupabase.auth.getSession();
    
    if (session) {
      this.usuarioLogueado = session.user;
      this.correoUsuario = session.user.email || 'Jugador';
    }

    // ---- Escuchar cambios en vivo (por si se loguea en otra pestaña) ----
    this.supabase.clienteSupabase.auth.onAuthStateChange((_event, session) => {
      this.ngZone.run(() => {
        if (session) {
          this.usuarioLogueado = session.user;
          this.correoUsuario = session.user.email || 'Jugador';
        } else {
          this.usuarioLogueado = null;
          this.correoUsuario = '';
        }
      });
    });
  }

  async cerrarSesion() {
    await this.supabase.clienteSupabase.auth.signOut();
    
    this.ngZone.run(() => {
      this.usuarioLogueado = null;
      this.correoUsuario = '';
      this.router.navigate(['/login']);
    });
  }
}