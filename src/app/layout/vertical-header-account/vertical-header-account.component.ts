import { Component, effect, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../core/services/auth/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FirebaseserviceauthService } from '../../core/services/auth/firebase/firebaseserviceauth.service';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { ShoppingCartService } from '../../shared/services/shopping-cart/shopping-cart.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-vertical-header-account',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, RouterModule, NotificationComponent, CommonModule, SharedModule],
  templateUrl: './vertical-header-account.component.html',
  styleUrl: './vertical-header-account.component.css',
})
export class VerticalHeaderAccountComponent   {
  @Input() headerType: string = '';
  @Output() login = new EventEmitter<boolean>();

  isLogged = signal(false);
  user = signal<any>(null);
  letters = signal('');

  constructor(
    private _authenticationService:AuthenticationService,
    private _firebaseServiceAuthService:FirebaseserviceauthService,
    private _shoppingCartService: ShoppingCartService
  ){
    _authenticationService.user$.subscribe((res:any)=>{
      if (res){
        this.isLogged.set(true);
        this.user.set(res);
        this.extractionData();
      } else {
        this.isLogged.set(false);
      }
    });
  }


  extractionData() {
    const initials = this.user().first_name.substring(0, 1) + this.user().last_name.substring(0, 1);
    this.letters.set(initials);
  }

  logout() {
    this._firebaseServiceAuthService.SignOut();
  }

  onOpenAdmin(){
    const url = 'https://app.pulqui.com.ar/marketplace/home'; // Replace with your desired URL
    window.open(url, '_blank'); // '_blank' opens it in a new tab
  }
}
