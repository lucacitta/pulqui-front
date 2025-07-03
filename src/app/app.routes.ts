import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { appResolver } from './app.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      initial: appResolver
    },
    children: [
      {
        path: '',
        redirectTo: '/marketplace/home',
        pathMatch: 'full',
      },
      {
        path: 'marketplace',
        loadChildren: () => import('./components/marketplace/marketplace.module').then(m => m.MarketplaceModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./components/marketplace/profile/profile.module').then(
            (m) => m.ProfileModule)
      },
      {
        path: 'history',
        loadComponent: () => import('./components/marketplace/purchase-history/purchase-history.component').then(m => m.PurchaseHistoryComponent),
      },
      {
        path: 'history/details/:id',
        loadComponent: () => import('./components/marketplace/purchase-history/components/purchase-detail/purchase-detail.component').then(m => m.PurchaseDetailComponent)
      },
      {
        path: 'favorites',
        loadChildren: () => import('./components/favorites/favorites.module').then((m) => m.FavoritesModule),
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
      },
    ],
  },
];
