import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Preguntas {

  private apiKey: string = 'b900779829e9498cb27f6060b78e590e';
  private url: string = `https://api.rawg.io/api/games?key=${this.apiKey}&page_size=40&ordering=-rating`;

  constructor(private http: HttpClient) {}

  async obtenerJuegos(): Promise<any[]> {
    try{
      // --- firstValueFrom() convierte el Observable de HttpClient en una Promesa, permitiendo usar async/await  ---
      const response: any = await firstValueFrom(this.http.get(this.url));
      // --- Filtra los juegos para incluir solo aquellos que tienen una imagen de fondo ---
      return response.results ? response.results.filter((juego: any) => juego.background_image) : [];
    }
    catch(error){
      console.error('Error al obtener juegos:', error);
      return [];
    }
}
}
