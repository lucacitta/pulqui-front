import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UdcService {
  constructor(private http: HttpClient) {}

  obtenerDetalleUDC(data: any): Observable<any> {
    const url = `${environment.URL_BACKEND}/udc/ObtenerDetalleUDC`;
    return this.http.post(url, data).pipe(
      map((res: any) => res),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error));
  }
}
