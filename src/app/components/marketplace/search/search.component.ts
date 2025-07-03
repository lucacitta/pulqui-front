import { Component, OnInit, effect } from '@angular/core';
import { SearchService } from './search.service';
import { CommonModule } from '@angular/common';
import { GridProductsComponent } from '../grid-products/grid-products.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importamos el spinner

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [CommonModule, GridProductsComponent, MatIconModule, MatProgressSpinnerModule]
})
export class SearchComponent implements OnInit {

  arrayProducts: any;
  isLoading: boolean = false;

  constructor(
    private _searchService: SearchService,
  ) {
    effect(() => {
      this.arrayProducts = this._searchService.productsFound$();
    });

    effect(() => {
      this.isLoading = this._searchService.buscando();
    });
  }

  ngOnInit() { }

  getProducts(item: any) {
    console.log("Item: ", item)
    return item;
  }
}
