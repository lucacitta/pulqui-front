import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  constructor(private _http: HttpClient) {}

  generarCotizacion(cotizacion: any): Observable<any> {
    const url = `${environment.URL_BACKEND}/cotizacion/epcotizacion`;

    return this._http.post<any>(url, cotizacion).pipe(
      map(res => {
        this.downloadPdf(res['pdf'], 'cotizacion', true);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  private downloadPdf(filebase64: string, nombrePdf: string, date: boolean = false): void {
    const link = `data:application/pdf;base64,${filebase64}`;
    const linkDescarga = document.createElement('a');
    const nombreArchivo = `${nombrePdf}${date ? '_' + Date.now() : ''}.pdf`;

    linkDescarga.href = link;
    linkDescarga.download = nombreArchivo;
    linkDescarga.click();
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
