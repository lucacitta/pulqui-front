import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StoresCompleteService {
  private baseUrl = environment.URL_BACKEND_PUBLIC;

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<any[]> {
    const url = `${this.baseUrl}/promociones/all`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getTiendas(): Observable<any> {
    const url = `${this.baseUrl}/tiendas`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getAllPromotions(user: string): Observable<any[]> {
    const url = `${this.baseUrl}/promociones/tienda/${user}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  savePromotion(promo: any): Observable<any> {
    const url = `${this.baseUrl}/promociones/save`;
    return this.http.post<any>(url, promo).pipe(
      catchError(this.handleError)
    );
  }

  editPromotion(promo: any): Observable<any> {
    const url = `${this.baseUrl}/promociones/update?id=${promo.id}`;
    return this.http.put<any>(url, promo).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
