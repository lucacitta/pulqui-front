import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Define la interfaz para las promociones
export interface Promotion {
  id: number;
  porcentaje_descuento: number;
  valor_descuento: number;
  valor_producto: number;
  valor_total: number;
  nombre_producto: string;
  descripcion_producto: string;
  enlace_imagen: string;
  [key: string]: any;
}

// Define la interfaz para las tiendas
export interface Store {
  cons_cliente: number;
  nombre_cliente: string;
  url_logo: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private _http: HttpClient) {}

  /**
   * Get all banners according to the fist version of the api
   * @returns Observable
   */
  getActiveBanners() {
    let url = environment.URL_BACKEND_PUBLIC + '/banner/active';
    return this._http.get(url);
  }

  /**
   * Get all categories according to the second version of the api
   * @returns Observable
   */
  getCategories(user_id: number) {
    return this._http.get(environment.URL_BACKEND_PUBLIC + '/categoriesV2/' + user_id);
  }

  /**
   * Get all promotions according to the fist version of the api
   * @returns Observable
   */
  getPromotions(): Observable<Promotion[]> {
    return this._http.get<Promotion[]>(`${environment.URL_BACKEND_PUBLIC}/promociones/all_V2`);
  }

  /**
   * Get all stores according to the first version of the api
   * @returns Observable
   */
  getStores(user_id: number): Observable<Store[]> {
    return this._http.get<Store[]>(`${environment.URL_BACKEND_PUBLIC}/tiendasV2/${user_id}`);
  }

  /**
   * Get all most sold products according to the second version of the api
   * @returns Observable
   */
  getMostSelledProducts(user_id: number) {
    return this._http.get(environment.URL_BACKEND_PUBLIC + `/paquetes/get_most_selled_products_v2/${user_id}`);
  }
}
