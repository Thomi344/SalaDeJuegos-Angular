import { Component, OnInit, signal } from '@angular/core';
import { Supabase } from '../../servicios/supabase';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class ResultadosComponent implements OnInit {

  // Signals para almacenar el Top 10 de cada juego
  topMayorMenor = signal<any[]>([]);
  topAhorcado = signal<any[]>([]);
  topPreguntados = signal<any[]>([]);
  topLogoQuiz = signal<any[]>([]);
  
  cargando = signal<boolean>(true);

  constructor(private supabase: Supabase) {}

  ngOnInit(): void {
    this.cargarTodosLosResultados();
  }

  async cargarTodosLosResultados() {
    this.cargando.set(true);
    
    try {
      // Usamos Promise.all para descargar las 4 tablas al mismo tiempo (mucho más rápido)
      // --- Cada función obtiene el Top 10 ordenado por puntaje (ordenado y filtrad en el servicio) ---
      const [mayorMenor, ahorcado, preguntados, logoQuiz] = await Promise.all([
        this.supabase.obtenerTopResultados('Mayor o Menor'),
        this.supabase.obtenerTopResultados('Ahorcado'),
        this.supabase.obtenerTopResultados('Preguntados'),
        this.supabase.obtenerTopResultados('Logo Quiz')
      ]);

      this.topMayorMenor.set(mayorMenor);
      this.topAhorcado.set(ahorcado);
      this.topPreguntados.set(preguntados);
      this.topLogoQuiz.set(logoQuiz);

    } catch (error) {
      console.error('Error cargando el salón de la fama:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // --- Método auxiliar para extraer el nombre del correo electrónico y que no quede tan largo en la tabla ---
  formatearUsuario(email: string): string {
    if (!email) return 'Anónimo';
    return email.split('@')[0]; // De "thomasdylan05@hotmail.com" devuelve solo "thomasdylan05"
  }
}