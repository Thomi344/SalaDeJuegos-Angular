import { Component,OnInit,signal } from '@angular/core';
import { Supabase } from '../../../servicios/supabase';
import { Preguntas } from '../../../servicios/preguntas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados-component',
  standalone:false,
  templateUrl: './preguntados-component.html',
  styleUrl: './preguntados-component.css',
})
export class PreguntadosComponent implements OnInit {
// --- Array local para guardar los 40 juegos descargados ---
  private juegosGuardados: any[] = [];

// --- Array para llevar el registro de qué juegos ya salieron en la ronda actual ---
  private juegosYaPreguntados: string[] = []; 

// --- Signals para manejar la reactividad en tiempo real de la pantalla ---
  preguntaActual = signal<any>(null);
  opciones = signal<string[]>([]);
  puntaje = signal<number>(0);
  numeroPregunta = signal<number>(0);
  maxPreguntas = signal<number>(10); // --- Ronda estándar de 10 preguntas ---
  cargando = signal<boolean>(true);
  juegoTerminado = signal<boolean>(false);

  // --- Signals para manejar el estado visual del feedback (Correcto/Incorrecto) ---
  opcionElegida = signal<string>(''); // --- Guarda qué botón tocó el usuario para poder pintarlo ---
  mostrarFeedback = signal<boolean>(false); // --- Indica si hay que mostrar el cartelito y bloquear la pantalla ---

  tiempoInicio: number = 0;  

  constructor(private supabase: Supabase,private preguntasService: Preguntas,private router: Router) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

 // --- Arranca la partida: descarga la data inicial si el dato está vacío ---
  async iniciarJuego() {
    this.cargando.set(true);
    this.juegoTerminado.set(false);
    this.puntaje.set(0);
    this.numeroPregunta.set(0);

    // --- Limpiamos los estados visuales del feedback al reiniciar ---
    this.opcionElegida.set('');
    this.mostrarFeedback.set(false);
    
    // ---  Vaciamos el registro de preguntas usadas al arrancar una nueva partida ---
    this.juegosYaPreguntados = [];

    this.tiempoInicio = Date.now();

    try {
      // --- Si es la primera partida, bajamos los datos de juegos. Si ya reintentó, usamos la memoria ---
      if (this.juegosGuardados.length === 0) {
        this.juegosGuardados = await this.preguntasService.obtenerJuegos();
      }
      
      this.generarSiguientePregunta();
    } catch (error) {
      console.error('Error al iniciar Preguntados:', error);
    } finally {
      this.cargando.set(false);
    }
  } 

  // --- Elige un juego correcto y 3 distractores incorrectos sin repetir el correcto ---
  generarSiguientePregunta() {
    // --- Si ya respondimos las 10 preguntas de la ronda, termina la partida ---
    if (this.numeroPregunta() >= this.maxPreguntas()) {
      this.finalizarJuego();
      return;
    }

    // --- Incrementa el contador de la pregunta actual con .update() ---
    this.numeroPregunta.update(n => n + 1);

    // --- Filtramos los juegos para descartar los que ya salieron en esta ronda ---
    const juegosDisponibles = this.juegosGuardados.filter(juego => !this.juegosYaPreguntados.includes(juego.name));

    // --- 1. Elije al azar el juego que va a ser la respuesta CORRECTA usando solo los disponibles ---
    const indiceCorrecto = Math.floor(Math.random() * juegosDisponibles.length);
    const juegoCorrecto = juegosDisponibles[indiceCorrecto];
    
    // --- Guarda el nombre del juego elegido para no volver a usarlo ---
    this.juegosYaPreguntados.push(juegoCorrecto.name);

    this.preguntaActual.set(juegoCorrecto);

    // --- 2. Genera las respuestas INCORRECTAS filtrando para no repetir el nombre correcto ---
    const opcionesFalsas: string[] = [];
    while (opcionesFalsas.length < 3) {
      const randomJuego = this.juegosGuardados[Math.floor(Math.random() * this.juegosGuardados.length)];
      if (randomJuego.name !== juegoCorrecto.name && !opcionesFalsas.includes(randomJuego.name)) {
        opcionesFalsas.push(randomJuego.name);
      }
    }

    // --- 3. Juntamos la correcta con las falsas y las mezclamos para que no quede siempre en el mismo botón ---
    const todasLasOpciones = [juegoCorrecto.name, ...opcionesFalsas];
    todasLasOpciones.sort(() => Math.random() - 0.5); // --- ordenación aleatoria ---
    
    this.opciones.set(todasLasOpciones);
  }

// --- Se ejecuta al clickear cualquiera de los 4 botones de respuesta ---
  responder(opcionSeleccionada: string) {
    // --- Agrega this.mostrarFeedback() para ignorar clicks repetidos si el cartelito ya está visible ---
    if (this.cargando() || this.juegoTerminado() || this.mostrarFeedback()) return;

    // --- Activa el feedback en pantalla y guardamos qué botón tocó el usuario ---
    this.mostrarFeedback.set(true);
    this.opcionElegida.set(opcionSeleccionada);

    // --- Si coincide el nombre del botón con el de la pregunta actual, sumamos un acierto ---
    if (opcionSeleccionada === this.preguntaActual().name) {
      this.puntaje.update(p => p + 1);
    }

    // --- Usa setTimeout para crear una pausa de 1.2 segundos y que el usuario pueda ver si acertó o falló ---
    setTimeout(() => {
      // Limpiamos los estados de feedback para que los botones vuelvan a la normalidad
      this.opcionElegida.set('');
      this.mostrarFeedback.set(false);
      
      // --- Pasamos a la siguiente tanda directamente ---
      this.generarSiguientePregunta();
    }, 1200);
  }

  // --- Registra el fin del juego y guarda los datos en Supabase ---
  async finalizarJuego() {
    this.juegoTerminado.set(true);
    const tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    
    // --- Ganó si acertó más del 50% de las preguntas de la ronda ---
    const ganoPartida = this.puntaje() >= (this.maxPreguntas() / 2);

    const detallesTrivia = {
      preguntas_totales: this.maxPreguntas(),
      respuestas_correctas: this.puntaje(),
      rendimiento_porcentaje: (this.puntaje() / this.maxPreguntas()) * 100
    };

    await this.supabase.guardarResultadoJuego(
      'Preguntados', 
      ganoPartida, 
      this.puntaje() * 10, // Multiplicamos por 10 para darle un formato de Score mayor
      tiempoTotal, 
      detallesTrivia
    );
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}