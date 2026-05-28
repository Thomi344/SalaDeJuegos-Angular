import { ChangeDetectorRef, OnInit, Component, NgZone } from '@angular/core';
import { Supabase } from '../../../servicios/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {

  // --- Dibuja los botones del teclado ---
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  
  // --- Lista hardcodeada  ---
  palabras = ['ANGULAR', 'JAVASCRIPT', 'PROGRAMACION', 'DESARROLLO', 'SUPEBASE'];

  // --- Variables de estado general del juego ---
  palabraOculta ='';
  letrasUsadas: string[] = [];
  errores = 0;
  maxErrores = 6;

  // --- Datos estadisticos para la base de datos ---
  intentosTotales = 0;
  tiempoInicio: number = 0;
  juegoTerminado = false;
  gano = false;

  // --- Array visual de las perdidas ---
  imagenesAhorcado: string[] = [
      'assets/ahorcado/ahorcado-0.png',
      'assets/ahorcado/ahorcado-1.png',
      'assets/ahorcado/ahorcado-2.png',
      'assets/ahorcado/ahorcado-3.png',
      'assets/ahorcado/ahorcado-4.png',
      'assets/ahorcado/ahorcado-5.png',
      'assets/ahorcado/ahorcado-6.png'
    ];

  // cdr (ChangeDetectorRef) y ngZone sirven para "despertar" a Angular y forzarlo a redibujar el HTML aunque podria usar signals  ---
  constructor(private supabase: Supabase,private cdr: ChangeDetectorRef,private ngZone: NgZone, private router: Router) {}

  ngOnInit(): void {this.iniciarJuego();}

  // --- Resetea todas las variables, elige una palabra nueva al azar y captura la hora exacta de inicio ---
  iniciarJuego() {
      this.palabraOculta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
      this.letrasUsadas = [];
      this.errores = 0;
      this.intentosTotales = 0;
      this.juegoTerminado = false;
      this.gano = false;
      this.tiempoInicio = Date.now();
    }

    // --- Revisa la palabra oculta y devuelve las letras descubiertas o un guion bajo '_' si  no se adivinó todavia ---
    get palabraMostrada(): string[] {
      return this.palabraOculta.split('').map(l => this.letrasUsadas.includes(l) ? l : '_');
    }

    // --- Metodo que se dispara al clickear una letra en el HTML ---
    async elegirLetra(letra: string) {
      // --- Si el juego ya termino o la letra ya se uso antes, corta la ejecucion para que no haga nada ---
      if (this.juegoTerminado || this.letrasUsadas.includes(letra)) return;

      this.letrasUsadas.push(letra);
      this.intentosTotales++;

      // --- Si la letra clickeada NO esta en la palabra oculta, sumamos un error ---
      if (!this.palabraOculta.includes(letra)) {
        this.errores++;
      }

      this.verificarEstado();
    }

    // --- Verifica en cada click si el jugador gano o perdio ---
    async verificarEstado() {
      // --- every() revisa si TODAS las letras de la palabra oculta estan adentro del array de letrasUsadas. Si es asa, significa que gano ---
      const victoria = this.palabraOculta.split('').every(l => this.letrasUsadas.includes(l));
      const derrota = this.errores >= this.maxErrores;

      if (victoria || derrota) {
        this.juegoTerminado = true;
        this.gano = victoria;
        
        // --- Calculamos los segundos restando el tiempo actual con el que guardamos al inicio ---
        const tiempoFinal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
        
        // --- Puntaje: si gano, multiplica las vidas sobrantes por 10. Si perdió, es 0 ---
        const puntajeFinal = victoria ? (this.maxErrores - this.errores) * 10 : 0;

        // --- objeto con info extra para la estadistica ---
        const detallesAhorcado = {
          errores_cometidos: this.errores,
          total_clicks: this.intentosTotales,
          palabra_asignada: this.palabraOculta
        };

        // --- Guarda en Supabase. ---
        await this.supabase.guardarResultadoJuego('Ahorcado', this.gano, puntajeFinal, tiempoFinal, detallesAhorcado);
        
        // --- Usamos ngZone y cdr para avisar que termino el juego ---
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      }
    }

    volverAlHome() {
      this.router.navigate(['/home']);
    }
}