import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { StoresCompleteComponent } from './stores-complete/stores-complete.component';
import { CategoryComponent } from './category/category.component';
import { GridProductsComponent } from './grid-products/grid-products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CompraRapidaComponent } from './compra-rapida/compra-rapida.component';
import { authGuard } from '../../shared/guard/auth.guard';
import { RespuestaPagoComponent } from './respuesta-pago/respuesta-pago.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Pulqui'
    },
  },
  {
    path: 'producto/:idProducto',
    component: ProductsComponent,
    data: {
      title: 'Producto',
      urls: [
        { title: 'Marketplace', url: '/marketplace' },
        { title: 'Categoria', url: '/marketplace/categoria/' },
        { title: 'Producto' },
      ],
    },
  },
  {
    path: 'categoria',
    component: GridProductsComponent,
    data: {
      title: 'Producto',
      urls: [{ title: 'Marketplace', url: '/categoria' }],
    },
  },
  {
    path: 'stores',
    component: StoresCompleteComponent,
  },
  {
    path: 'products',
    component: CategoryComponent,
  },
  {
    path: 'shopping-cart',
    canActivate: [authGuard],
    component: ShoppingCartComponent,
  },
  {
    path: 'quick-buy',
    canActivate: [authGuard],
    component: CompraRapidaComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
    // canActivate: [authGuard],
  },
  {
    path: 'respuesta-pago',
    component: RespuestaPagoComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceRoutingModule { }
