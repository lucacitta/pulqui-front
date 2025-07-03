import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministradorService {
  constructor(private http: HttpClient) {}

  obtenerProductosbyReferencia(user: number, referencia: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.URL_BACKEND_PUBLIC}/producto/obtener_productos_hijosV2/${user}/${referencia}`)
      .pipe(catchError(this.handleError));
  }
  obtenerProductosbyReferenciaHijo(referencia: string): Observable<any[]> {
    return this.http
      .post<any[]>(`${environment.URL_BACKEND_PUBLIC}/producto/obtener_producto_hijo`, { referencia })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
