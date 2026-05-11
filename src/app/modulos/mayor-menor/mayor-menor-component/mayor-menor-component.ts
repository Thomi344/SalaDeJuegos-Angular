import { ChangeDetectorRef,signal, Component, NgZone, OnInit } from '@angular/core';
import { Supabase } from '../../../servicios/supabase';
import { Cartas } from '../../../servicios/cartas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mayor-menor-component',
  standalone:false,
  templateUrl: './mayor-menor-component.html',
  styleUrl: './mayor-menor-component.css',
})
export class MayorMenorComponent implements OnInit{
  deckId = signal<string>('');
  cartaActual = signal<any>(null);
  cargando = signal<boolean>(true);
  puntaje = signal<number>(0);
  juegoTerminado = signal<boolean>(false);

  // --- Variables estándar---
  tiempoInicio: number = 0;
  cartaAnterior: any = null;

  // --- Diccionario para convertir los valores de texto de la API en números comparables ---
  valoresCartas: { [key: string]: number } = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'JACK': 11, 'QUEEN': 12, 'KING': 13, 'ACE': 14 
  };

  constructor(
    private supabase: Supabase,
    private cartasService: Cartas,
    private router: Router
  ) {}

  // --- Al iniciar el componente, disparamos la creacion del mazo ---
  ngOnInit() {
    this.iniciarJuego();
  }

  // --- Configura el estado inicial, limpia el puntaje y pide el mazo al servicio ---
  async iniciarJuego() {
    this.cargando.set(true); 
    this.juegoTerminado.set(false);
    this.puntaje.set(0);
    this.tiempoInicio = Date.now();

    try {
      // --- Obtenemos el ID del mazo desde el servicio con cache ---
      const id = await this.cartasService.crearMazo();
      this.deckId.set(id);
      await this.pedirNuevaCarta();
    } catch (error) {
      console.error("Error al iniciar el mazo", error);
      this.cargando.set(false);
    }
  }

  // --- Llama al servicio para obtener una carta y actualiza la señal de la carta actual ---
  async pedirNuevaCarta() {
    this.cargando.set(true);
    try {
      const nuevaCarta = await this.cartasService.sacarCarta(this.deckId());
      this.cartaActual.set(nuevaCarta);
    } catch (error) {
      console.error("Error al obtener la carta", error);
    } finally {
      this.cargando.set(false);
    }
  }

  // --- Procesa la elección del usuario y compara los valores numericos ---
  async adivinar(eleccion: 'MAYOR' | 'MENOR') {
    if (this.cargando() || this.juegoTerminado()) return;
    
    this.cartaAnterior = this.cartaActual();
    await this.pedirNuevaCarta();

    const valorViejo = this.valoresCartas[this.cartaAnterior.value];
    const valorNuevo = this.valoresCartas[this.cartaActual().value];

    // --- Si el valor es igual, se considera acierto para mejorar la jugabilidad ---
    let acerto = false;
    if (valorNuevo === valorViejo) {
      acerto = true;
    } else if (eleccion === 'MAYOR' && valorNuevo > valorViejo) {
      acerto = true;
    } else if (eleccion === 'MENOR' && valorNuevo < valorViejo) {
      acerto = true;
    }

    if (acerto) {
      // --- .update() permite modificar el valor basandose en el anterior ---
      this.puntaje.update(p => p + 1);
    } else {
      this.finalizarJuego();
    }
  }

  // --- Calcula estadisticas finales  ---
  async finalizarJuego() {
    this.juegoTerminado.set(true);
    
    const tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const resultadoExitoso = this.puntaje() > 0;

    // --- Detalles especificos para la columna de la base de datos ---
    const detalles = {
      aciertos: this.puntaje(),
      ultima_carta: `${this.cartaActual().value} de ${this.cartaActual().suit}`,
      mazo_id: this.deckId()
    };

    await this.supabase.guardarResultadoJuego(
      'Mayor o Menor', 
      resultadoExitoso, 
      this.puntaje(), 
      tiempoTotal, 
      detalles
    );
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}