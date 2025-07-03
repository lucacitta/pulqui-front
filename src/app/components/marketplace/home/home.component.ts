import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BannersComponent } from './components/banners/banners.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { MostSelledProductsComponent } from './components/most-selled-products/most-selled-products.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { StoresComponent } from './components/stores/stores.component';
import { CategoriesMenuComponent } from './components/categories-menu/categories-menu.component';
import { BannerHomeComponent } from './components/banner-home/banner-home.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    BannersComponent,
    CategoriesComponent,
    MostSelledProductsComponent,
    PromotionsComponent,
    StoresComponent,
    CategoriesMenuComponent,
    BannerHomeComponent,
  ],
})
export class HomeComponent implements OnInit {
  public number: number = 0;

  constructor(
    private route: ActivatedRoute,

    private titleService: Title,

  ) {}

  ngOnInit() {
    // Establecer el título desde los datos de la ruta
    const title = this.route.snapshot.data['title'] || 'Default Title';
    this.titleService.setTitle(title);

  }



  increase() {
    this.number++;
  }

  decrease() {
    if (this.number === 0) return;
    this.number--;
  }

  
}
