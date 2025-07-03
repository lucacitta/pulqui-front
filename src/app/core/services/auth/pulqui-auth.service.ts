import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NewUser } from '../../models/user';


@Injectable({
  providedIn: 'root',
})
export class PulquiAuthService {
  private URL_BACKEND = environment.URL_BACKEND;
  private URL_BACKEND_PUBLIC =environment.URL_BACKEND_PUBLIC
  constructor(private http: HttpClient) {
  }

  opcionesHttp = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  nuevousuariopulqui(correo: any) {
    let Data = {
      correo,
    };
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/nuevousuariopulqui`, Data);
  }

  sendnotification(correo: any, titulo: any, mensaje: any) {
    let Data = {
      correo,
      titulo,
      mensaje,
    };
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/sendnotification`, Data);
  }

  
  valaidarUsuario(correo:string) {
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/validar_usuario_creado`,{correo});
  }
  validarTokenRecaptcha(token:string) {
    return this.http.post(`${this.URL_BACKEND_PUBLIC}/validate/human`,{"recaptchaToken":token});
  }


  putActualizarEmpresa(formulario: any) {
    return this.http
      .put(this.URL_BACKEND + '/pulquiAuth/ActualizarEmpresaClientes', formulario)
        .pipe(
          map((res:any) => {
            return res;
          })
      )
  }

  EmpresasRegistradas(correo: any, titulo: any, mensaje: any) {
    let Data = { correo, titulo, mensaje };
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/EmpresasRegistradas`, Data);
  }

  nuevo_usuario_pulqui_v2(data: NewUser) {
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/nuevo_usuario_pulqui_v2`, data);
  }

  validar_usuario_v2(correo: string){
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/validar_usuario_v2`, {correo: correo});
  }
}
