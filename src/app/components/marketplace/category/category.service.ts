import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  filterUpdate: EventEmitter<any> = new EventEmitter();

  constructor(private _http: HttpClient) { }

  public isFavoritesReady$ = signal<boolean>(false)

  emitFilterChangeEvent(data: any) {
    this.filterUpdate.emit(data);
  }

  getFilterChangeEmitter() {
    return this.filterUpdate;
  }

  allProducts() {
    const url = `${environment.URL_BACKEND_PUBLIC}/products`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  allProductsPrice() {
    const url = `${environment.URL_BACKEND_PUBLIC}/products_all`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getTienda(cons_cliente: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/tienda/${cons_cliente}`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  interestProducts(cons_producto: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/paquetes/get_products_interest?consProducto=${cons_producto}`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  mostSelledProducts() {
    const url = `${environment.URL_BACKEND_PUBLIC}/paquetes/get_most_selled_products`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getProductUpgradeAvailable(cons_producto: any, cons_per_pago_producto: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/upgrade-available?cons_producto=${cons_producto}&cons_periodicidad=${cons_per_pago_producto}`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  inspiredProducts(cons_persona: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/paquetes/get_inspired_products?consPersona=${cons_persona}`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  allProductsCategory(idCategory: any,idSubCategory: any, data: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/category/${idCategory}/subcategory/${idSubCategory}/products`;

    return this._http.post(url, data).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  allProductsCategoryPromotion(idCategory: any, data: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/category/${idCategory}/products/cliente`;
    return this._http.post(url, data).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  allProductsStore(idTienda: any, data: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/tienda/${idTienda}/products`;
    return this._http.post(url, data).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  detailProduct(idProduct: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/product/${idProduct}/profile`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  detailProductCaracteristicas(idProduct: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/perfil/caracteristicas-fisicas/${idProduct}`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  allProductsSubCategory(idCategory: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/subcategory/${idCategory}/products`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getFlix(cons_cliente: number) {
    const url = `${environment.URL_BACKEND}/lists-flix?cons_cliente=${cons_cliente}`;
    return this._http.get(url).pipe(
      map((resp: any) => resp),
      catchError(this.handleError)
    );
  }

  getColorList() {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/colorList/`;
    return this._http.post(url, []).pipe(
      catchError(this.handleError)
    );
  }

  getColorsForValdiate(parent_reference: any) {
    const url = `${environment.URL_BACKEND_PUBLIC}/producto/getColorsAndSizesByReference`;
    return this._http.post(url, { parent_reference }).pipe(
      catchError(this.handleError)
    );
  }

  getCategories() {
    return this._http.get(environment.URL_BACKEND_PUBLIC + '/categories').pipe(
      catchError(this.handleError)
    );
  }

  getFilters({ idTienda, idCategoria, idSubCategoria }: { idTienda: number, idCategoria: number, idSubCategoria: number }) {
    const url = `${environment.URL_BACKEND_PUBLIC}/filters?idTienda=${idTienda}&idCategoria=${idCategoria}&idSubCategoria=${idSubCategoria}`;
    return this._http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('colorError', error);
    return throwError(() => new Error(error.status));
  }
}
