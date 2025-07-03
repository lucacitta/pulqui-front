// src/app/core/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  of,
  throwError,
  map,
  tap,
  catchError,
  finalize,
  shareReplay
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { UserLogin } from '../../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.URL_BACKEND}/roles/getPermission`;

  /** Cache de permisos por key `${userId}_${role}` */
  private permissionCache = new Map<string, boolean>();

  /** Peticiones en vuelo para dedupe */
  private inFlight = new Map<string, Observable<boolean>>();

  constructor(
    private http: HttpClient,
    private _authenticationService: AuthenticationService
  ) {}

  /**
   * 1) Si ya pedí este permiso antes, lo devuelvo del cache (of(cached)).
   * 2) Si hay una petición en curso para la misma key, devuelvo ese mismo Observable.
   * 3) Si no hay ni cache ni inFlight, hago POST, comparto con shareReplay(1),
   *    guardo en cache al llegar y limpio inFlight en finalize.
   */
  rolePermit(idUsuario: number, role: string): Observable<boolean> {
    const key = `${idUsuario}_${role}`;

    // 1) cache
    if (this.permissionCache.has(key)) {
      return of(this.permissionCache.get(key)!);
    }

    // 2) request en vuelo
    const pending$ = this.inFlight.get(key);
    if (pending$) {
      return pending$;
    }

    // 3) nueva petición
    const request$ = this.http
      .post<{ data: boolean }>(this.url, { userId: idUsuario, permis: role })
      .pipe(
        map(resp => resp.data),
        tap(hasPerm => this.permissionCache.set(key, hasPerm)),
        finalize(() => this.inFlight.delete(key)),
        shareReplay(1),
        catchError(err => this.handleError(err))
      );

    this.inFlight.set(key, request$);
    return request$;
  }

  /**
   * Devuelve el usuario actual de forma SÍNCRONA, leyendo localStorage
   * (para que ProfileStore/BussinessStore sigan llamándolo sincrónicamente).
   */
  getUser(): UserLogin | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UserLogin;
    } catch {
      return null;
    }
  }

  haveBussiness(): boolean {
    const user = this.getUser();
    return !!(user && user.client_id !== null);
  }

  completedProfile(): boolean {
    const user = this.getUser();
    return !!(user && user.first_name !== null);
  }

  /**
   * Cuántos productos hay en el carro de compras
   */
  checkItemsShop(): number {
    const itemsShop = localStorage.getItem('itemsShop');
    return itemsShop ? parseInt(itemsShop, 10) : 0;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AuthService error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
