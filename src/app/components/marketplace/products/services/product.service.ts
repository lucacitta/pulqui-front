import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CalificacionModel } from '../../../../models/calificacion.model';
import { EnviarCalificacionModel } from '../../../../models/enviar-calificacion.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _httpClient: HttpClient) {}

  detailProduct(idProduct: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/product/${idProduct}/profile`;
    return this._httpClient.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }
  getColorList() {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/colorList/`;
    return this._httpClient.post(url, []).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }
  detailProductCaracteristicas(idProduct: string): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/perfil/caracteristicas-fisicas/${idProduct}`;
    return this._httpClient.get<any>(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getColorsForValdiate(parent_reference: string): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/getColorsAndSizesByReference`;
    return this._httpClient.post(url, { parent_reference }).pipe(catchError(this.handleError));
  }

  obtenerListaCalificaciones(id: any): Observable<CalificacionModel[]> {
    return this._httpClient
      .get<CalificacionModel[]>(`${environment.URL_BACKEND_PUBLIC}/product/${id}/comment`)
      .pipe(catchError(this.handleError));
  }

  enviarCalificacion(calificacion: EnviarCalificacionModel): Observable<CalificacionModel> {
    return this._httpClient
      .post<CalificacionModel>(`${environment.URL_BACKEND_PUBLIC}/product/comment`, calificacion)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error));
  }
}
