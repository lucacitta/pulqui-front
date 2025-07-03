import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CodigoDescuento } from '../../../models/codigo-descuento.model';
import { DescuentoAplicado } from '../../../models/descuento-aplicado.mode';

@Injectable({
  providedIn: 'root',
})
export class CodigosService {
  constructor(private _httpClient: HttpClient) {}

  getCodigos(): Observable<CodigoDescuento[]> {
    const url = `${environment.URL_BACKEND_PUBLIC}/codigo-descuento`;
    return this._httpClient.get<CodigoDescuento[]>(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getUserCodigos(userId: number): Observable<CodigoDescuento[]> {
    const url = `${environment.URL_BACKEND_PUBLIC}/codigo-descuento/estado-codigos-cliente?cons_cliente=${userId}&tipo=O`;
    console.log(url);
    return this._httpClient.get<CodigoDescuento[]>(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }
  getCodigobyUser(user: number): Observable<CodigoDescuento[]> {
    const url = `${environment.URL_BACKEND_PUBLIC}/codigo-descuento/userV2?id=${user}`;
    return this._httpClient.get<CodigoDescuento[]>(url).pipe(catchError(this.handleError));
  }

  obtenerDescuentoAplicado(id: number): Observable<DescuentoAplicado[]> {
    const url = `${environment.URL_BACKEND_PUBLIC}/codigo-descuento/obtener_descuento_aplicado?id=${id}`;
    return this._httpClient.get<DescuentoAplicado[]>(url).pipe(catchError(this.handleError));
  }
  borrarAplicacionDescuento(id: number): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/codigo-descuento/borrar_aplicacion_descuento?id=${id}`;
    return this._httpClient.put<any>(url, {}).pipe(catchError(this.handleError));
  }
  aplicarDescuento(params: any): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/codigo-descuento/aplicar_descuento`;
    return this._httpClient.post<any>(url, params).pipe(
      map(res => res as any[]),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error));
  }
}
