import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '8JqSnisZgVe9mcf8X8yEc4DHJQykn53g';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {

      this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
      this.resultados = JSON.parse( localStorage.getItem('ultimos-resultados')!) || [];
  }
  
  buscarGifs( query: string = '' ) {
    
    query = query.trim().toLocaleLowerCase();
    
    if ( !this._historial.includes( query )) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify( this._historial ));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( ( response ) => {
        this.resultados = response.data;
        localStorage.setItem('ultimos-resultados', JSON.stringify( this.resultados) );
      });

  }

}
