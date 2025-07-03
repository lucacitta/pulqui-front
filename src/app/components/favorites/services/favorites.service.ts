// src/app/components/favorites/services/favorites.service.ts
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, finalize, shareReplay } from 'rxjs/operators';
import { FavoritesProducts } from '../../../models/favorites_products.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  /** Cache interno: usuario → lista de favoritos */
  private cache = new Map<number, any[]>();

  /** Peticiones “en vuelo”: usuario → Observable<FavoritesProducts> */
  private inFlight = new Map<number, Observable<FavoritesProducts>>();

  /** Señal pública con la lista de favoritos actuales */
  favorites$ = signal<any[]>([]);

  private contratoUrl = `${environment.URL_BACKEND}/favorites_products`;

  /** Comprueba si ya tengo cache para este usuario */
  hasCache(usuario: number): boolean {
    return this.cache.has(usuario);
  }

  /** Borra la cache (por si la querés invalidar manualmente) */
  clearCache(usuario: number): void {
    this.cache.delete(usuario);
  }

  /**
   * Trae la lista de favoritos:
   * - Si hay cache: no hace HTTP, emite de inmediato el cache.
   * - Si ya hay un POST/list en curso para este usuario: devuelve ese mismo Observable.
   * - Si no, lanza un POST → /list, guarda la petición en `inFlight`, y al resolver:
   *     • elimina la entrada de `inFlight`
   *     • popula `cache` y `favorites$`
   */
  getFavorites(data: { usuario: number }): Observable<FavoritesProducts> {
    const usuario = data.usuario;

    // 1) Si está cacheado, devolvemos of(...) sin tocar Network
    const cached = this.cache.get(usuario);
    if (cached) {
      this.favorites$.set(cached);
      return of({ data: cached, msm: 'Success', code: 200 });
    }

    // 2) Si ya hay una petición en vuelo, devolvemos la misma instancia
    const pending$ = this.inFlight.get(usuario);
    if (pending$) {
      return pending$;
    }

    // 3) Si no hay cache ni petición en vuelo, lanzamos una nueva
    const request$ = this.http
      .post<FavoritesProducts>(`${this.contratoUrl}/list`, data)
      .pipe(
        tap(response => {
          // Al llegar la respuesta, poblamos cache y señal
          this.cache.set(usuario, response.data);
          this.favorites$.set(response.data);
        }),
        finalize(() => {
          // Quitamos la petición en vuelo
          this.inFlight.delete(usuario);
        }),
        // shareReplay asegura que TODOS los subscribers compartan la misma llamada
        shareReplay({ bufferSize: 1, refCount: true })
      );

    // Guardamos la petición en vuelo antes de devolverla
    this.inFlight.set(usuario, request$);
    return request$;
  }

  /**
   * Añade un favorito y actualiza cache + señal:
   * - response.data debe traer el registro añadido.
   */
  addFavorites(data: { usuario: number; producto: number }): Observable<FavoritesProducts> {
    return this.http.post<FavoritesProducts>(`${this.contratoUrl}/add`, data).pipe(
      tap(response => {
        const usuario = data.usuario;
        const current = this.favorites$();
        const toAdd = response.data.filter(
          item =>
            !current.some(
              fav => fav.cons_productos_favoritos === item.cons_productos_favoritos
            )
        );
        const updated = [...current, ...toAdd];
        this.cache.set(usuario, updated);
        this.favorites$.set(updated);
      })
    );
  }

  /**
   * Elimina un favorito y actualiza cache + señal:
   * - Usa `data.favorite` para identificar el registro correcto.
   */
  removeFavorites(data: {
    usuario: number;
    producto: number;
    favorite: any;
  }): Observable<FavoritesProducts> {
    return this.http.post<FavoritesProducts>(`${this.contratoUrl}/delete`, data).pipe(
      tap(() => {
        const usuario = data.usuario;
        const updated = this.favorites$().filter(
          fav =>
            fav.cons_producto !== data.producto &&
            fav.cons_productos_favoritos !== data.favorite
        );
        this.cache.set(usuario, updated);
        this.favorites$.set(updated);
      })
    );
  }

  constructor(private http: HttpClient) { }
}
