// categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { HomeService } from '../../home.service';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  public categories: any[] = [];
  user_id = 0;
  isAuthenticated = false;
  isLoading = false;

  constructor(
    private _homeService: HomeService,
    private _authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._authenticationService.user$.subscribe({
      next: (user) => {
        this.user_id = user?.idUsuario ?? 0;
        this.isAuthenticated = !!user?.idUsuario;
        this.getCategories();
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.getCategories();
      },
    });
  }

  getCategories() {
    this.isLoading = true;
    this._homeService
      .getCategories(this.user_id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => (this.categories = Array.isArray(res) ? res : []),
        error: (err) => {
          console.error('Error loading categories:', err);
          this.categories = [];
        },
      });
  }

  openCategory(category: any) {
    this.router.navigate(['/marketplace/products'], {
      queryParams: { category: category.id },
    });
  }

  /** trackBy para optimizar ngFor */
  trackById(index: number, item: any): any {
    return item.id ?? index;
  }
}
