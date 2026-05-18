import { Component, OnInit,signal } from '@angular/core';
import { Router } from '@angular/router';
import { Supabase } from '../../../servicios/supabase';

@Component({
  selector: 'app-logo-quiz-component',
  standalone: false,
  templateUrl: './logo-quiz-component.html',
  styleUrl: './logo-quiz-component.css',
})
export class LogoQuizComponent implements OnInit{

  // --- Nombre de Carpetas de Marcas ---
  private carpetasMarcas = [
    'Apple', 'Disney', 'EAsports', 'Google', 'Kinder', 'LG', 'McDonalds', 
    'Microsoft', 'Nike', 'Samsung', 'Superman', 'Telegram', 'Toyota', 
    'WarnerBros', 'Whatsapp'
  ];
  private extension = '.jpg';

  // --- Construcción dinámica losLogos ---
  private logosImg = this.carpetasMarcas.map(marca => {
    return {
      nombre: marca,
      opciones: [
        { imagen: `assets/logos/${marca}/real${this.extension}`, esCorrecto: true },
        { imagen: `assets/logos/${marca}/falsa1${this.extension}`, esCorrecto: false },
        { imagen: `assets/logos/${marca}/falsa2${this.extension}`, esCorrecto: false },
        { imagen: `assets/logos/${marca}/falsa3${this.extension}`, esCorrecto: false }
      ]
    };
  });

  // --- Signals del Estado del Juego ---
  listaMezclada: any[] = [];
  rondaActual = signal<number>(0);
  
  vidas = signal<number>(5);
  puntaje = signal<number>(0);
  juegoTerminado = signal<boolean>(false);
  opcionesActuales = signal<{imagen: string, esCorrecto: boolean}[]>([]);
  marcaActual = signal<string>('');
  
  // --- Signals para manejar el estado visual del feedback (Rojo/Verde) ---
  opcionElegida = signal<{imagen: string, esCorrecto: boolean} | null>(null);
  mostrarFeedback = signal<boolean>(false);

  tiempoInicio: number = 0;

  constructor(private supabase: Supabase, private router: Router) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.vidas.set(5);
    this.puntaje.set(0);
    this.rondaActual.set(0);
    this.juegoTerminado.set(false);

    // --- Limpia los estados visuales del feedback al reiniciar ---
    this.opcionElegida.set(null);
    this.mostrarFeedback.set(false);

    this.tiempoInicio = Date.now();

    // --- Mezcla las imagenes general de marcas ---
    this.listaMezclada = [...this.logosImg].sort(() => Math.random() - 0.5);
    this.cargarRonda();
  }

  cargarRonda() {
    if (this.vidas() <= 0 || this.rondaActual() >= this.listaMezclada.length) {
      this.finalizarJuego();
      return;
    }

    const nivel = this.listaMezclada[this.rondaActual()];
    this.marcaActual.set(nivel.nombre);

    // --- Agarra las 4 imágenes de esta marca y las mezcla para que la 'real' caiga en cualquier botón ---
    const opcionesMezcladas = [...nivel.opciones].sort(() => Math.random() - 0.5);
    this.opcionesActuales.set(opcionesMezcladas);
  }

  // --- Recibe la opción completa para poder pintarla en pantalla y aplica el delay ---
  elegirLogo(opcion: {imagen: string, esCorrecto: boolean}) {
    // Si ya terminó o estamos mostrando el color de la ronda anterior, bloqueamos el click
    if (this.juegoTerminado() || this.mostrarFeedback()) return;

    // Activa las signals para que el HTML pinte los bordes de verde o rojo
    this.mostrarFeedback.set(true);
    this.opcionElegida.set(opcion);

    if (opcion.esCorrecto) {
      this.puntaje.update(p => p + 20); // 20 puntos por acierto
    } else {
      this.vidas.update(v => v - 1);
    }

    // --- Pausa de 1.2 segundos para ver el feedback antes de pasar al siguiente logo ---
    setTimeout(() => {
      this.opcionElegida.set(null);
      this.mostrarFeedback.set(false);

      if (this.vidas() === 0) {
        this.finalizarJuego();
      } else {
        // --- Pasa a la siguiente marca ---
        this.rondaActual.update(r => r + 1);
        this.cargarRonda();
      }
    }, 1200);
  }

  async finalizarJuego() {
      this.juegoTerminado.set(true);
      const tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
      const ganoPartida = this.vidas() > 0; 

      const detalles = {
        vidas_restantes: this.vidas(),
        rondas_jugadas: this.rondaActual(),
        aciertos: this.puntaje() / 20 
      };

      // --- Guardado directo en la DB ---
      await this.supabase.guardarResultadoJuego('Logo Quiz', ganoPartida, this.puntaje(), tiempoTotal, detalles);
    }

    volverAlHome() {
      this.router.navigate(['/home']);
    }
}