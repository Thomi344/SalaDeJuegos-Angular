import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Supabase } from '../../servicios/supabase';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports : [CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {
  
  // --- Referencia al contenedor del chat para auto-scrollear hacia abajo ---
  @ViewChild('contenedorMensajes') 
  contenedorMensajes!: ElementRef;

  // --- Signals ---
  mensajes = signal<any[]>([]);
  mensajeActual = signal<string>('');
  cargando = signal<boolean>(true);

  // --- Datos del usuario actual ---
  miUsuario: string = '';
  suscripcionRealtime: any;

  constructor(
    private supabase: Supabase,
    private router: Router,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    this.cargando.set(true);
    
    try {
      // --- Quién es el usuario logueado para diferenciar los mensajes ---
      const usuarioLogueado = await this.supabase.obtenerUsuarioLogueado(); 
      this.miUsuario = usuarioLogueado?.email || 'anonimo@mail.com';

      //--- Traemos el historial viejo ---
      const historial = await this.supabase.obtenerHistorialChat();
      this.mensajes.set(historial || []);
      
      this.hacerScrollHaciaAbajo();

      //--- Nos suscribimos para escuchar mensajes nuevos en tiempo real---
      this.suscripcionRealtime = this.supabase.suscribirseAlChat((nuevoMensaje) => {
        //--- ngZone para asegurar que Angular se entere de este evento externo---
        this.ngZone.run(() => {
          this.mensajes.update(mensajesViejos => [...mensajesViejos, nuevoMensaje]);
          this.hacerScrollHaciaAbajo();
        });
      });

    } catch (error) {
      console.error('Error al cargar el chat:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // --- Se desuscribe al salir para no gastar recursos de Supabase ---
  ngOnDestroy() {
    if (this.suscripcionRealtime) {
      this.suscripcionRealtime.unsubscribe();
    }
  }

  // --- Se dispara al apretar Enter o el botón de enviar ---
  async enviarMensaje() {
    const texto = this.mensajeActual().trim();
    if (!texto) return;

    // Limpiamos el input instantáneamente
    this.mensajeActual.set(''); 

    try {
      await this.supabase.enviarMensajeChat(this.miUsuario, texto);
      //NO agregamos el mensaje a la lista acá manualmente. 
      // Dejamos que la suscripción Realtime lo reciba y lo agregue. Así garantiza sincronización real.
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  }

  // --- Método para capturar lo que el usuario escribe en el input ---
  actualizarMensaje(event: Event) {
    const input = event.target as HTMLInputElement;
    this.mensajeActual.set(input.value);
  }

  // --- Truco visual: Mueve la barra de scroll al último mensaje ---
  hacerScrollHaciaAbajo() {
    setTimeout(() => {
      if (this.contenedorMensajes) {
        this.contenedorMensajes.nativeElement.scrollTop = this.contenedorMensajes.nativeElement.scrollHeight;
      }
    }, 100); // Pequeño delay para dejar que Angular dibuje el HTML primero
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}