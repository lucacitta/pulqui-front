import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, throwError, tap } from 'rxjs';
import { DatosPagoModel, UsuarioModel } from '../interfaces/datos-pago';
import { environment } from '../../../../../environments/environment';
import { Bank } from '../../../../models/bank.model';

@Injectable({
  providedIn: 'root',
})
export class AccionPagoService {
  constructor(private http: HttpClient) {}

  generarReferenciaMercadoPago(
    usuario: UsuarioModel,
    totalCompra: number,
    idSolicitudContrato: number,
    iva: number,
    tipoCompra: string
  ): Observable<DatosPagoModel> {
    const current = new Date();
    const timestamp = current.getTime();
    const numero_orden = `${usuario.client_id}_${timestamp}`;

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const cons_client = user.client_id;

    const data = {
      amount: Number.parseFloat(totalCompra.toFixed(2)),
      tax: 0,
      taxReturnBase: 0,
      buyerEmail: usuario.Au,
      buyerFullName: usuario.Ad,
      extra1: idSolicitudContrato.toString(),
      extra2: tipoCompra,
      extra3: numero_orden,
      cons_client: cons_client,
      user_id: usuario.id,
    };

    return this.http.post<DatosPagoModel>(`${environment.URL_BACKEND}/mercadopago/reference`, data).pipe(
      map((res: DatosPagoModel) => ({
        ...res,
      })),
      tap((res: DatosPagoModel) => {
        console.log('Referencia MercadoPago generada:', res);
      }),
      catchError(this.handleError)
    );
  }

  traerMetodosPago(cons_carro: any): Observable<{ code: number; data: Bank[]; error?: any }> {
    return this.http.get<{ code: number; data: any[]; error?: any }>(`${environment.URL_BACKEND_PUBLIC}/banks/${cons_carro}`);
  }

  subirDocumentos(fd: FormData): Observable<any> {
    return this.http.post<any>(`${environment.URL_BACKEND}/upload/file`, fd).pipe(catchError(this.handleError));
  }

  actualizarArchivos(datos: any): Observable<any> {
    return this.http.post<any>(`${environment.URL_BACKEND}/update/files`, datos).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  /**
   * Función para cambiar estado del carro de compras a espera de soporte de pago
   * @param id
   */
  cambiarAOtrosMedios(id: number): Observable<any> {
    const url = `${environment.URL_BACKEND}/shopping_car/request_other_source`;
    const body = { car: id };

    return this.http.post<any>(url, body).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }
}
