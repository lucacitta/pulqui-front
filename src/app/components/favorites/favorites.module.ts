import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from './services/favorites.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FavoritesRoutes } from './favorites.routes';
import { GridProductsComponent } from '../marketplace/grid-products/grid-products.component';

@NgModule({
  declarations: [FavoritesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridProductsComponent,
    RouterModule.forChild(FavoritesRoutes)
  ], 
  providers: [
    FavoritesService,
  ]
})
export class FavoritesModule { }
