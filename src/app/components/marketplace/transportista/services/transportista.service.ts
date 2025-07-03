import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransportistaService {
  constructor(private _http: HttpClient) {}

  getAllTransportistas(): Observable<any[]> {
    return this._http
      .get<any[]>(`${environment.URL_BACKEND_PUBLIC}/transportistas/allTransportadores`)
      .pipe(catchError(this.handleError));
  }

  getTransportista(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.URL_BACKEND_PUBLIC}/transportistas/getTransportista/${id}`)
      .pipe(catchError(this.handleError));
  }

  getInfoTransportista(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.URL_BACKEND_PUBLIC}/transportistas/getInfoTransportista/${id}`)
      .pipe(catchError(this.handleError));
  }

  newTransportista(datos: any): Observable<any> {
    return this._http
      .post<any>(`${environment.URL_BACKEND_PUBLIC}/transportistas/newTransportista`, datos)
      .pipe(catchError(this.handleError));
  }

  newTransportistaCliente(datos: any): Observable<any> {
    return this._http
      .post<any>(`${environment.URL_BACKEND_PUBLIC}/transportistas/newTransportistaCliente`, datos)
      .pipe(catchError(this.handleError));
  }

  updateTransportista(datos: any): Observable<any> {
    return this._http
      .post<any>(`${environment.URL_BACKEND_PUBLIC}/transportistas/updateTransportista`, datos)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
