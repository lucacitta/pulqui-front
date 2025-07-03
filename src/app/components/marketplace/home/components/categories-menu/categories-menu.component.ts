import { Component } from '@angular/core';
import { HomeService } from '../../home.service';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';

@Component({
  selector: 'app-categories-menu',
  standalone: true,
  imports: [],
  templateUrl: './categories-menu.component.html',
  styleUrl: './categories-menu.component.css'
})
export class CategoriesMenuComponent {
  public categories: any = ''; //TODO: create types
  user_id: number = 0;
  isAuthenticated = false;

  constructor(private _homeService: HomeService, private _authenticationService: AuthenticationService){}

  ngOnInit(): void {
    this._authenticationService.user$.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          this.user_id = user.idUsuario;
          this.getCategories();
          this.isAuthenticated = true;
        } else {
          this.user_id = 0;
          this.getCategories();
          this.isAuthenticated = false;
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  getCategories(){
    this._homeService.getCategories(this.user_id).subscribe(res=>{
      this.categories = JSON.stringify(res, null, "\t");
    });
  }
}
