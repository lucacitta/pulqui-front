import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from './profile.types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _http: HttpClient) {}

  getProfile(idUsuario: number): Observable<any[]> {
    return this._http.get<any[]>(`${environment.URL_BACKEND}/user/${idUsuario}`);
  }

  getAddressByCode(): Observable<any> {
    return this._http.get(`${environment.URL_BACKEND_PUBLIC}/direccion/obtener_direcciones/`);
  }

  postFile(fileToUpload: File, path: string, cons_persona: any): Observable<any> {
    let url = environment.URL_BACKEND + '/perfil/actualizar-foto';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('path', path);
    formData.append('cons_persona', cons_persona);
    return this._http.post(url, formData);
  }

  postFileLogo(fileToUpload: File, path: string, cons_cliente: any): Observable<any> {
    let url = environment.URL_BACKEND + '/perfil/actualizar-logo';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('path', path);
    formData.append('cons_cliente', cons_cliente);
    return this._http.post(url, formData);
  }

  getTokenUser(user: any): Observable<any> {
    let cons_client = user.client_id;

    let body = {
      cons_user: cons_client,
    };
    return this._http.post(`${environment.URL_BACKEND}/perfil/getTokenUser`, body);
  }

  verifyUserToken(user: any): Observable<any> {
    const body = {
      cons_user: user,
    };
    return this._http.post(`${environment.URL_BACKEND}/perfil/verificarTokenUser`, body);
  }

  saveTokenUser(user: any, token: any, action: any): Observable<any> {
    const body = {
      cons_user: user,
      token,
      action: action,
    };

    return this._http.post(`${environment.URL_BACKEND}/perfil/guardarTokenUser`, body);
  }

  updateCompanyProfileInfo(datosActualizados: ProfileModel): Observable<ProfileModel> {
    return this._http.put<ProfileModel>(`${environment.URL_BACKEND}/perfil/actualizar-empresa`, datosActualizados);
  }

  deleteTokenUser(user: any): Observable<any> {
    return this._http.delete(`${environment.URL_BACKEND}/perfil/eliminarTokenUser/${user}`);
  }

  updateDataUser(dataUser: ProfileModel): Observable<ProfileModel> {
    return this._http.put<ProfileModel>(`${environment.URL_BACKEND}/perfil/actualizar`, dataUser);
  }
}
