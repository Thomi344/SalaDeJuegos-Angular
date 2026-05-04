import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Supabase } from '../../servicios/supabase'; 

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css' 
})
export class Navbar implements OnInit {
  
  usuarioLogueado: any = null;
  correoUsuario: string = '';

  constructor(
    private supabase: Supabase,
    private router: Router,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    // ---- 1. Verificamos sesión inicial ----
    const { data: { session } } = await this.supabase.clienteSupabase.auth.getSession();
    
    if (session) {
      this.usuarioLogueado = session.user;
      this.correoUsuario = session.user.email || 'Jugador';
    }

    // ---- 2. Escucha cambios (por si el usuario se loguea o desloguea) ----
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
      this.router.navigate(['/login']); // Lo mandamos al login al salir
    });
  }
}