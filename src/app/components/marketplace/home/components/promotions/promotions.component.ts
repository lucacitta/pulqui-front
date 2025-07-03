import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../home.service';
import { CardProductoComponent } from '../../../../../shared/components/card-producto/card-producto.component';
import { CommonModule } from '@angular/common';

import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.css',
  standalone: true,
  imports: [RouterLink, RouterOutlet,CardProductoComponent,CommonModule]

})
export class PromotionsComponent implements OnInit {
  public promotions: Promotion[] = []; // Usamos un array tipado

  constructor(private _homeService: HomeService,
    private _authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this._authenticationService.user$.subscribe({
      next: user => {
        this.getPromotions();
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
    
  }

  getPromotions(): void {
    this._homeService.getPromotions().subscribe(
      (res: Promotion[]) => {
        console.log(res);
        this.promotions = res; // Asignamos directamente los datos recibidos
      },
      (error) => {
        console.error('Error al obtener las promociones:', error);
        this.promotions = []; // Aseguramos que esté vacío si hay un error
      }
    );
  }

  trackByPromotion(index: number, promotion: Promotion): number {
    return promotion.id;
  }
}

// Creamos un tipo para las promociones
interface Promotion {
  id: number;
  porcentaje_descuento: number;
  valor_descuento: number;
  valor_producto: number;
  valor_total: number;
  nombre_producto: string;
  descripcion_producto: string;
  enlace_imagen: string;
  [key: string]: any; // Otros campos opcionales
}
