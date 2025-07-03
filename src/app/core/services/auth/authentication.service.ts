import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Register, Login, Profile } from '../../../models/user.model';
//import { FirebaseService } from '@shared/services/FirebaseService';

import { Router } from '@angular/router';

//import { AuthService } from 'dvt-lib';
declare var gapi: any;
@Injectable({
  providedIn: 'root',

})
export class AuthenticationService {
  public _user = new BehaviorSubject<any>(null);
  public _errorUser = new BehaviorSubject<any>(null);
  private URL_BACKEND = environment.URL_BACKEND;

  // 2020-09-07 se cambia por httpClient pero se deja http para no alterar lógica de inicio de sesión
  constructor(
    private http: HttpClient,
    //private http2: HttpClient,
    //private firebaseService: FirebaseService,
    public router: Router //private authService: AuthService
  ) {}
  get user$() {
    return this._user.asObservable();
  }
  set user(value: any) {
    this._user.next(value);
  }
  get errorUser$() {
    return this._errorUser.asObservable();
  }
  set errorUser(value: any) {
    this._errorUser.next(value);
  }


  initClient() {

  }

  registerUser(user: Register): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/user/signup`, { data: user }).pipe(
      catchError(err => {
        return throwError({ code: err.status, msg: JSON.parse(err._body).msg });
      })
    );
  }

  loginUser(email: string): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/user/signin`, { data: { username: email } }).pipe(
      catchError(err => {
        this._errorUser.next('Usuario No existe Valide la información e intente nuevamente.');
        return throwError({ code: err.msg, msg: JSON.parse(err._body).error });
      })
    );
  }

  registerUserWithGoogle(user: Profile): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/social_user/signup`, { data: user }).pipe(
      catchError(err => {
        return throwError({ code: err.status, msg: JSON.parse(err._body).msg });
      })
    );
  }

  validateUserGoogle(email: string): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/validate/user`, { data: { username: email } }).pipe(
      catchError(err => {
        return throwError({ code: err.status, msg: JSON.parse(err._body).error });
      })
    );
  }

  confirmAccount(token: string): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/user/account/confirm`, { data: { validation_token: token } }).pipe(
      catchError(err => {
        return throwError({ code: err.status, msg: JSON.parse(err._body).msg });
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/user/password/recovery`, {
      data: { username: email },
    });
  }
  recuperarPassword(data: any): Observable<any> {
    return this.http.post(`${this.URL_BACKEND}/user/password/new`, data);
  }

  verifyToken(data: string): Observable<any> {
    return this.http.post<any>(`${this.URL_BACKEND}/verify_token_client`, { token: data });
  }

  updateClient(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_BACKEND}/update_client_info`, formData);
  }

  queryContract(idClient: string): Observable<{ code: number; msg: string; data: any; detail: string }> {
    return this.http.get<{ code: number; msg: string; data: any; detail: string }>(
      `${this.URL_BACKEND}/contract_user/${idClient}`
    );
  }

  autorizaTratamientoDatos(uuid: string): Observable<{ user_idtbl_usuario: string; user_autoriza_tratamiento_datos: boolean }> {
    return this.http.get<{ user_idtbl_usuario: string; user_autoriza_tratamiento_datos: boolean }>(
      `${this.URL_BACKEND}/users/autoriza-tratamiento-datos/${uuid}`
    );
  }

  confirmarTratamientoDatos(uuid: string): Observable<{
    id: number;
    autorizaTratamientoDatos: boolean;
    fechaAutorizacion: Date;
  }> {
    return this.http.put<{
      id: number;
      autorizaTratamientoDatos: boolean;
      fechaAutorizacion: Date;
    }>(`${this.URL_BACKEND}/users/confirmar-tratamiento-datos/${uuid}`, {});
  }

  newuserpulqui(correo: any) {
    let data = {
      correo,
    };
    return this.http.post(`${this.URL_BACKEND}/pulquiAuth/nuevousuariopulqui`, data);
  }

  newRegisterEnterprise(
    NombreEmpresa: any,
    Telefono: any,
    Cuit: any,
    NombreContacto: any,
    Procesado: any,
    CorreoElectronico: any
  ) {
    let Data = {
      NombreEmpresa,
      Telefono,
      Cuit,
      NombreContacto,
      Procesado,
      CorreoElectronico,
    };
    return this.http.post(
      `${this.URL_BACKEND}/pulquiAuth/NuevoRegistroEmpresaClientes`,
      Data
    );
  }
}


