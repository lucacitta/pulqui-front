import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OtrosMediosPagosService {
  private readonly baseUrl: string = `${environment.URL_BACKEND}`;

  constructor(private http: HttpClient) {}

  cargarListaTodosOMP(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/compras_omp`).pipe(tap(res => console.log('Lista de todos OMP cargada', res)));
  }

  cargarListaProductosCompra(cons_carro_compra: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/producto_compras/${cons_carro_compra}`)
      .pipe(tap(res => console.log('Lista de productos de compra cargada', res)));
  }

  getFacturaUrl(cons_solicitud_comercial: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/factura_url?solicitud_comercial=${cons_solicitud_comercial}`)
      .pipe(tap(res => console.log('URL de factura obtenida', res)));
  }

  actualizarestado(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/update/request_mkp`, data)
      .pipe(tap(res => console.log('Estado actualizado', res)));
  }

  actualizarestadoPago(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/update/request`, data)
      .pipe(tap(res => console.log('Estado de pago actualizado', res)));
  }
}
