import { Component, OnInit, Input, signal, ChangeDetectorRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CardProductoComponent } from '../../../shared/components/card-producto/card-producto.component';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../favorites/services/favorites.service';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';

import { environment } from '../../../../environments/environment';
import { CategoryService } from '../category/category.service';



@Component({
  selector: 'app-grid-products',
  templateUrl: './grid-products.component.html',
  styleUrls: ['./grid-products.component.scss'],
  imports: [CardProductoComponent, CommonModule, MatProgressSpinnerModule],
  standalone: true,
})
export class GridProductsComponent implements OnInit {
  constructor(
    private favoritosService: FavoritesService,
    private _authenticationService: AuthenticationService,
    public _categoryService: CategoryService,
    private cdr: ChangeDetectorRef

  ) {
    this._authenticationService.user$.subscribe(user => {
      this.idUsuario = user?.idUsuario;
      this._categoryService.isFavoritesReady$.set(false)

      if (this.idUsuario) {
        this.getFavorites();
      } else {
        this._categoryService.isFavoritesReady$.set(true)
      }
    });
  }


  @Input() elements: any;
  favorites = signal([]);
  idUsuario: number = 0;


  ngOnInit() {
    if (this.idUsuario) {
      this.getFavorites();
    }
  }

  ngOnChanges() {
    if (this.elements) {
      this.elements.forEach((e: any) => {
        let url = environment.urlPublic + '/marketplace/products/' + e.cons_producto
        var color = 'basic'
        let find_favorite = this.favorites().findIndex(i => i == e.cons_producto)
        if (find_favorite !== -1)
          color = 'accent'
        e.color = color
        e.url = url
      });
    }
  }

  getFavorites() {
    var array_ids: any = [];
    this.favoritosService.getFavorites({ usuario: this.idUsuario }).subscribe((response: any) => {
      const responseData = response.data
      responseData.forEach((data: any) => {
        array_ids.push(data.cons_producto)
      });

      this.favorites.set(array_ids)
      this._categoryService.isFavoritesReady$.set(true);
      this.cdr.detectChanges();
    });
  }

  /** Función para fijar los decimales de la calificación de un producto */
  adjustedScore(score: number) {
    if (score === null) {
      return 0;
    }
    return score % 1 === 0 ? score : score.toFixed(2);
  }
}
