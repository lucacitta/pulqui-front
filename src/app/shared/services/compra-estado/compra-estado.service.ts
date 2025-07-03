import { Paquete } from './../../../models/paquete.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraEstadoService {
  constructor(private _http: HttpClient) {}

  updateCompra(data: any): Observable<any> {
    return this._http.post(`${environment.URL_BACKEND}/update_support_cartV2`, data).pipe(catchError(this.handleError));
  }
  cancelarCompra(id: number): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/shopping_cart_cancel`;
    const body = { id_cart: id };

    return this._http.post<any>(url, body).pipe(catchError(this.handleError));
  }
  actualizarSoporte(formData: FormData): Observable<any> {
    return this._http.put<any>(`${environment.URL_BACKEND}/upload_support_cart`, formData).pipe(catchError(this.handleError));
  }
  traerActualSoporte(idCarro: number): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/request_cart_active/${idCarro}`;
    return this._http.get<any>(url).pipe(catchError(this.handleError));
  }
  enviarSoporte(formData: FormData): Observable<any> {
    return this._http.post(`${environment.URL_BACKEND}/upload_support_cart`, formData);
  }

  checkTRM(): Observable<any> {
    return this._http.get(`${environment.URL_BACKEND_PUBLIC}/search/trm?date=${new Date().toISOString().split('T')[0]}`);
  }
  direccionCarro(json: any): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/direccion/guardar_carro_direcciones`;
    return this._http.post<any>(url, json).pipe(catchError(this.handleError));
  }

  obtenerDireccionByCodigo(): Observable<any> {
    return this._http.get(`${environment.URL_BACKEND_PUBLIC}/direccion/obtener_direcciones/`);
  }
  obtenerProvincia(CodigoAR: string): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/provincias/obtener_provincias/${CodigoAR}`;
    return this._http.get<any>(url).pipe(catchError(this.handleError));
  }
  direccionEnvio(json: any): Observable<any> {
    return this._http.post(`${environment.URL_BACKEND_PUBLIC}/direccion/registro_direccion`, json);
  }

  obtenerLocalidades(CodigoProv: number): Observable<any> {
    return this._http.get(`${environment.URL_BACKEND_PUBLIC}/localidades/obtener_localidades/${CodigoProv}`);
  }
  obtenerDireccionFacturacionByCodigo(): Observable<any> {
    return this._http.get(`${environment.URL_BACKEND_PUBLIC}/direccion_factura/obtener_direcciones_facturacion`);
  }
  direccionEnvioFacturacion(json: any): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/direccion_factura/registro_direccion_facturacion`;
    return this._http.post<any>(url, json).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }
  setCompraTransportistas(data: any): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/direccion/guardar_paquetes`;
    return this._http.post<any>(url, data).pipe(
      map(resp => resp),
      catchError(this.handleError)
    );
  }
  getCompraTransportistas(): Observable<any> {
    const url = `${environment.URL_BACKEND_PUBLIC}/direccion/calcular_envio`;
    return this._http.get<any>(url).pipe(
      map(resp => resp),
      catchError(this.handleError)
    );
  }
  updateContract(idClient: number, idCart: number): Observable<{ code: number; msg: string; data: any }> {
    return this._http.post<{ code: number; msg: string; data: any }>(`${environment.URL_BACKEND}/contract_user`, {
      idClient,
      idCart,
    });
  }
  obtenerUsuarioCliente(idCliente: number): Observable<any> {
    const body = { id: idCliente };
    return this._http.post<any>(`${environment.URL_BACKEND}/pulquiAuth/getUserCliente`, body).pipe(
      map(resp => resp),
      catchError(this.handleError)
    );
  }
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  obtenerResumenCompra(idUser: number, paquetes: Paquete[], estado: number = 0,): Observable<any> {
    let data:any = [];
    paquetes.forEach(e=>{
      if(e.selected){
        data.push({valorEnvio: e.valorEnvio, transportista: e.tramportista});
      }
    });
    return this._http.post(`${environment.URL_BACKEND}/shopping_car/${idUser}/resumenCompraV2/${estado}`, {paquetes: data});
  }
}
