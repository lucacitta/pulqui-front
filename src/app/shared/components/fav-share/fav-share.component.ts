// fav-share.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { FavoritesService } from '../../../components/favorites/services/favorites.service';

@Component({
  selector: 'app-fav-share',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './fav-share.component.html'
})
export class FavShareComponent implements OnInit {
  @Input() item!: any;
  @Input() idProduct?: number;

  idUsuario = 0;
  readonly prodId = computed(() => this.idProduct ?? this.item?.cons_producto);
  readonly isFavorite = computed(() => {
    const pid = this.prodId();
    return pid
      ? this.favService.favorites$().some(fav => fav.cons_producto === pid)
      : false;
  });

  constructor(
    private authService: AuthenticationService,
    private favService: FavoritesService
  ) { }

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe(u => {
      this.idUsuario = u?.idUsuario ?? 0;
      if (this.idUsuario && !this.favService.hasCache(this.idUsuario)) {
        // carga inicial
        this.favService.getFavorites({ usuario: this.idUsuario }).subscribe();
      }
    });
  }

  toggleFavorite(): void {
    const pid = this.prodId();
    if (!pid || !this.idUsuario) return;

    const op$ = this.isFavorite()
      ? this.favService.removeFavorites({
        usuario: this.idUsuario,
        producto: pid,
        favorite: this.item.cons_productos_favoritos
      })
      : this.favService.addFavorites({
        usuario: this.idUsuario,
        producto: pid
      });

    op$.pipe(take(1)).subscribe(() => {
      // 1) Borro cache para forzar recarga
      this.favService.clearCache(this.idUsuario);
      // 2) Re-cargo TODO el listado y actualizo la señal
      this.favService
        .getFavorites({ usuario: this.idUsuario })
        .subscribe();
    });
  }
}
