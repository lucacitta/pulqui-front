import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, lastValueFrom, forkJoin, of } from 'rxjs';
import { Terms } from '../../models/terms.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private _httpClient: HttpClient) {}

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Current-User': '{}',
    });
  }

  getShopCartStore(): Observable<any> {
    const headers = this.createHeaders();
    return this._httpClient.get(`${environment.URL_BACKEND}/shopping_cart/get_store`, { headers }).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getProrrateoProduct(
    cantidad: number,
    periodicidad: number,
    cons_producto: number,
    cons_usuario: number,
    cons_carro?: number
  ): Observable<any> {
    let params = new HttpParams()
      .append('cantidad', cantidad.toString())
      .append('periodicidad', periodicidad.toString())
      .append('cons_producto', cons_producto.toString())
      .append('cons_usuario', cons_usuario.toString());

    if (cons_carro) {
      params = params.append('cons_carro', cons_carro.toString());
    }

    const headers = this.createHeaders();
    return this._httpClient.get(`${environment.URL_BACKEND}/wishlist/product/prorrateo`, { params, headers }).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  createrenewAgreement(data: any): Observable<any> {
    const headers = this.createHeaders();
    return this._httpClient.post(`${environment.URL_BACKEND}/renewAgreement`, data, { headers }).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  addItemList(jsonObj: Object): Observable<any> {
    const headers = this.createHeaders();
    return this._httpClient.post(`${environment.URL_BACKEND}/wishlist/product`, jsonObj, { headers }).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  checkItemsShop(): number {
    return parseInt(localStorage.getItem('itemsShop') || '0', 10);
  }

  updateItemsSho(items: number): void {
    localStorage.setItem('itemsShop', items.toString());
  }

  addCartItems(jsonObj: Object, cons_cliente: string) {
    return this._httpClient
      .post(environment.URL_BACKEND + '/shopping_cart/create_new_multiple/tienda/' + cons_cliente, jsonObj)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(this.handleError)
      );
  }

  getShopCart(idUser: number): Observable<any> {
    if (!idUser) {
      return throwError(() => new Error('User ID is required'));
    }
    return this._httpClient.get(environment.URL_BACKEND + '/shopping_car/' + idUser).pipe(catchError(this.handleError));
  }

  calcularStocks(jsonObj: Object): Observable<any> {
    return this._httpClient.post(`${environment.URL_BACKEND_PUBLIC}/producto/calcular_stocks`, jsonObj).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }
  deleteProductOfCart(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${environment.URL_BACKEND}/wishlist/product/${id}`);
  }
  updateTermsToShopCar(terms: Terms): Observable<any> {
    return this._httpClient
      .post<any>(`${environment.URL_BACKEND}/shopping_car/accept_terms`, terms)
      .pipe(catchError(this.handleError));
  }
  async updateInfoDiscountProducs(data: object): Promise<any> {
    try {
      const response = await lastValueFrom(
        this._httpClient
          .post<any>(`${environment.URL_BACKEND}/shopping_cart/update_info_discount_products`, data)
          .pipe(catchError(this.handleError))
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Ha ocurrido un error en la actualizacion de items list', error);
      throw error;
    }
  }

  updateItemLista(id_usuario: number, id_carro_compra: number) {
    return this._httpClient.put(`${environment.URL_BACKEND}/shopping_cart/update_info_discount_productsV2/${id_usuario}/${id_carro_compra}`, {})
  }

  createShopCarInvoice(idUser: number, aplica_factura: boolean, detalle: any[]): Observable<any[]> {
    const array_observables: Observable<any>[] = detalle.map(element =>
      this.addItemListv2({
        product: element.cons_producto,
        quantity: element.cantidad,
        period: element.cons_periodicidad_pago,
        product_type: element.tipo_producto,
        usuario: idUser,
        number_period: element.cantidad,
        factura: element.cons_factura_renovacion ? element.cons_factura_renovacion : element.factura,
        aplica_factura,
      })
    );

    return forkJoin(array_observables);
  }

  addItemListv2(jsonObj: Object): Observable<any> {
    console.log('obj desde el servicio', jsonObj);
    return this._httpClient.post(environment.URL_BACKEND + '/wishlist/product', jsonObj).pipe(catchError(this.handleError));
  }
  getShopCartInvoice(idUser: number, idFactura: number): Observable<any> {
    if (!idUser) {
      return of(null);
    }
    return this._httpClient
      .get(`${environment.URL_BACKEND}/shopping_car/invoice/${idUser}/${idFactura}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error(error));
  }
}
