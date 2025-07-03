import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { io } from "socket.io-client";
import { lastValueFrom, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  httpClient:Object;
  readonly url:string= environment.urlSocket;

  constructor(public _http: HttpClient) {
    
    this.httpClient = {
      Headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    } 

    this.socket = io(this.url,{ 
      'forceNew': true, transports: ["websocket"],reconnection:true,reconnectionDelay:1000 , secure:true
    });

  }

  async saveNotificaciones (notification:any){
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones/save';
    try {
      return await lastValueFrom(this._http.post(url, notification));
    }
    catch(error){
      this.handleError(error)
      return null;
    }
  }

  async getNotificaciones (): Promise<any[]>{
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones';
    return new Promise(async (resolve,reject)=>{
      try {
        let res = await lastValueFrom(this._http.get(url));
        resolve (res as any[]);
      } catch (error) {
        this.handleError(error);
      }
    })
  };


  async getNotificacionesPlataform (userId:any): Promise<any[]>{
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones/historico_notificacion_plataforma?cons_cliente='+userId;
    return new Promise(async (resolve,reject)=>{
      try {
        let res =  await lastValueFrom(this._http.get(url));
        resolve(res as any[]);
      }
      catch(error){
        this.handleError(error)
      }
    
    })
  };

  async recordatorios (): Promise<any[]>{
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones/recordatorios'
    return new Promise(async (resolve,reject)=>{
      try {
        let res =  await lastValueFrom(this._http.get(url));
        resolve(res as any[]);
      }
      catch(error){
        this.handleError(error)
      }
    
    })
  }

  async getNotificacion(id:any): Promise<any[]> {
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones';
    return new Promise(async (resolve,reject)=>{
      try {
        let response =  await lastValueFrom(this._http.get(url)) as any[];
        let res = response.find(element => element.id == id);

        resolve(res);
      }
      catch(error){
        this.handleError(error)
      }
    
    })
  }

  updateNotificacion (notification:any){
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones/update?id='+ notification.id;
    return new Promise(async (resolve,reject)=>{
      try {
        let res =  await lastValueFrom(this._http.put(url, notification));
        resolve(res);
      }
      catch(error){
        this.handleError(error)
      }
    
    })
  }

  private handleError(error: any) {
    return throwError(() => new Error(error));

  }
 
  socket: any;

  listen (eventName:string){

    return new Observable((subscriber)=>{
      this.socket.on(eventName, (args:any) => {
        subscriber.next(args);
      });
    })

  }

  emit  (eventName:string, costClient:any){
    let cons = {
      cons_cliente: costClient
    }
    let str = JSON.stringify(cons)
    this.socket.emit(eventName,str,(answer:any) =>{
    })
  }

  inactivate(id:any){
    let url = environment.URL_BACKEND_PUBLIC + '/notificaciones/inactivateNotificacion?id='+ id;
    return new Promise(async (resolve,reject)=>{
      try {
        let res =  await lastValueFrom(this._http.put(url, {}));
        resolve(res);
      }
      catch(error){
        this.handleError(error)
      }
    })
    
  }

}
