import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

interface DocumentResponse {
  code: number;
  data: any[];
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  constructor(private http: HttpClient) {}

  getDocuments(cons_cliente: number): Observable<DocumentResponse> {
    return this.http
      .get<DocumentResponse>(`${environment.URL_BACKEND}/archivos/?cons_cliente=${cons_cliente}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || error));
  }
}
