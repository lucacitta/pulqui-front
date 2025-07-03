import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PurchaseHistoryService {

  constructor(private _http: HttpClient) { }

  getHistorial(startDate: any, endDate: any) {
    return this._http.get<any>(environment.URL_BACKEND_PUBLIC + `/shoppingV2/usuario/start/${startDate}/end/${endDate}`);
    // return this._http.get<any>(environment.URL_BACKEND_PUBLIC + `/shopping/usuario/start/${startDate}/end/${endDate}`);
  }

  getHistorialByCompra(id: number) {
    return this._http.get<any>(environment.URL_BACKEND_PUBLIC + `/shoppingV2/compra/${id}`)
  }

  // getDayDevoluciones(user): Observable<any> {
  //   return this._http.get<any>(environment.URL_BACKEND_PUBLIC + "/days-limit/tienda/" + user).map((res) => {
  //     return res;
  //   });
  // }

  // getDevoluciones(startDate, endDate, user): Observable<any> {
  //   let data = {
  //     startDate: startDate,
  //     endDate: endDate,
  //     user: user,
  //   }
  //   return this._http.get<any>(environment.URL_BACKEND_PUBLIC + "/request/start/" + startDate + "/end/" + endDate + "/tienda/" + user).map((res) => {
  //     return res;
  //   });
  // }

  // setDaysDevoluciones(days: any, user: any): Observable<any> {
  //   return this._http.put<any>(environment.URL_BACKEND_PUBLIC + "/config-returns/cliente/" + user + "/dias/" + days, {}).map((res) => {
  //     return res;
  //   });
  // }

  setDevolucion(data: any): Observable<any> {
    console.log(data);

    return this._http.post(environment.URL_BACKEND_PUBLIC + '/return/item-lista', data)
  }

  setConfirmarDevolucion(data: any, id: any): Observable<any> {
    console.log("Data: ", data);

    return this._http.put(environment.URL_BACKEND_PUBLIC + '/return/item-lista/response/devolucion/' + id, data)
  }

}
