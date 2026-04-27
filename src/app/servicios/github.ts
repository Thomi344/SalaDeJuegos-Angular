import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Github {
  private readonly apiUrl = 'https://api.github.com/users/thomi344';
  constructor(private http: HttpClient ){}

    obtenerDatosGithub(){
      return this.http.get(this.apiUrl);
    }
  
}
