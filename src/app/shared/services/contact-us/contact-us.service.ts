import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http: HttpClient) { }

  obtenerAsuntos() {
    const data = {
      cons_codigo_definido_usuario: "AS",
      cons_codigo_producto: "00A"
    }
    return this.http.post(`${environment.URL_BACKEND}/udc/ObtenerDetalleUDC`, data);
  }

  saveContactUs(data: any) {
    return this.http.post(environment.URL_BACKEND + '/contact', data);
  }
}
