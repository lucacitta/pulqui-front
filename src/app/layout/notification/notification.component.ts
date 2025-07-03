import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from './services/notification.service';
import { AuthenticationService } from '../../core/services/auth/authentication.service';
import { CommonModule } from '@angular/common';
import { DateTransformPipe } from '../../shared/pipes/date-transform.pipe';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatButtonModule,MatIconModule, MatBadgeModule,MatMenuModule,CommonModule,DateTransformPipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  public data: any;
  client: any;
  notifications:any = [];
  unread: number = 0;

  constructor(private notificacionesService:NotificationService,
              private _authenticationService:AuthenticationService) 
  {
    _authenticationService.user$.subscribe((res:any)=>{
      this.client= res;
    })
  }

  ngOnInit(): void {
    this.getNotification();

    this.notificacionesService.listen('notificaciones').subscribe((data)=>{
      this.notifications = data;
      this.unread = this.notifications.length;
    })

    this.notificacionesService.listen('alert-notificaciones').subscribe((data)=>{
      this.emitConnection();
    })

    this.emitConnection();
  }

  emitConnection() {
    this.notificacionesService.emit('notificacion', {
      client_id: this.client.client_id,
      email: this.client.email
    });
  }

  conver(content:any, tipe:any){
    let text = JSON.parse(content);
    let answer = text[tipe];
    return answer;
  };

  async getNotification() {
    this.notifications = await this.notificacionesService.getNotificacionesPlataform(this.client.client_id);
    this.notifications.forEach((element:any) => {
    });
    this.unread = this.notifications.length;
  }

  markAsRead(){
    this.unread = 0;
  }

  async inactivateNotification(event:any, id:any){
    try {
      event.stopPropagation();
      const result = await this.notificacionesService.inactivate(id);
      this.deleteNotification(id);
    } catch (error) {
      console.log('error', error);
    }
  }

  deleteNotification(id:any){
    let notificaciones = [...this.notifications];
    notificaciones = notificaciones.filter(e=> e.id !== id);
    this.notifications = [...notificaciones];
  }

  openLink($event:any, item:any){
    //If there is link, do the routine
    if(item.link){
      $event.stopPropagation();
      window.open(item.link);
    }
    
  }

}
