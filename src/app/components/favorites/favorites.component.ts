import { Component, OnInit, AfterViewInit, effect } from '@angular/core';
import { FavoritesService } from './services/favorites.service';
import { AuthenticationService } from '../../core/services/auth/authentication.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  profile: any;
  favorites_data: any[] = [];

  constructor(private _favoritesService: FavoritesService, private _authenticationService: AuthenticationService) {
    effect(() => {
        this.favorites_data = this._favoritesService.favorites$(); 
    });
  }

  ngOnInit() {
    this._authenticationService.user$.subscribe(user => {
      if (user) {
        this.profile = user;
        this._favoritesService.getFavorites({ usuario: this.profile.idUsuario || 0 }).subscribe();
      }
    });
  }
}
