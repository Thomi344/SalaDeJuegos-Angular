import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Github {
  private readonly apiUrl = 'https://api.github.com/users/thomi344';
  private DatosCache:any = null;

  constructor(private http: HttpClient ){}

    obtenerDatosGithub(){
      if(this.DatosCache){
        return of( this.DatosCache);
      }
      return this.http.get(this.apiUrl).pipe(
            tap(res => this.DatosCache = res)
          );
  }
  /* 
  ---
  .pipe(): Intercepta la respuesta de la API para guardar una copia en el cache.
  tap(): Permite ejecutar una acción secundaria (guardar en cache) sin modificar la respuesta original.
  of(): Devuelve un Observable que emite el valor almacenado en cache, permitiendo que los componentes que consumen este servicio sigan funcionando sin cambios, independientemente de si los datos provienen de la API o del cache.
  ---
  */
}
