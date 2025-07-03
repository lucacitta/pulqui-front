import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  buscando = signal(false); // ← ahora es signal
  productsFound$ = signal([]);
  public _search = new BehaviorSubject<string>('');

  constructor(public _http: HttpClient) { }

  search(query: any) {
    let url = environment.URL_BACKEND_PUBLIC + '/search';
    let json = JSON.stringify({ query: query });
    let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    this.buscando.set(true); // Empezamos a buscar

    return this._http.post(url, json, { headers: headers }).subscribe((resp: any) => {
      console.log("Response: ", resp);
      this.productsFound$.set(resp);
      this.buscando.set(false); // Terminó la búsqueda
      return resp;
    }, error => {
      console.error('Error en búsqueda', error);
      this.buscando.set(false); // Error también corta el loading
    });
  }
}
