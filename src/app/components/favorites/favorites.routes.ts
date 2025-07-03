import { Routes } from '@angular/router';
import { FavoritesComponent } from './favorites.component';

export const FavoritesRoutes: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    children: [
      {
        path: 'favorites',
        component: FavoritesComponent
      }
    ]
  }
];