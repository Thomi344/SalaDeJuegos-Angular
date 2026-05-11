import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cartas {
  // --- Llama a la API, pide un mazo mezclado y devuelve SOLAMENTE el ID del mazo ---
  private deckIdCache: string | null = null;

  async crearMazo(): Promise<string> {
    // --- Si ya tenemos un mazo en memoria, lo usamos para ahorrar tiempo ---
    if (this.deckIdCache) return this.deckIdCache;

    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    this.deckIdCache = data.deck_id;
    return data.deck_id;
  }

  async sacarCarta(deckId: string): Promise<any> {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    return (data.cards && data.cards.length > 0) ? data.cards[0] : null;
  }
} 
