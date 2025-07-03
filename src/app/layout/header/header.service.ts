import { effect, inject, Injectable, signal } from '@angular/core';
import { RegisterComponent } from '../../components/auth/register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingCartService } from '../../shared/services/shopping-cart/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  readonly dialog = inject(MatDialog);

  itemsCart$ = signal(0);

  constructor(
    public _http: HttpClient

  ) {

  }
  initLogin($event = false) {
    this.dialog.open(RegisterComponent, {
      width: '25rem',
      data: {
        login: $event,
      },
    });
  }

  getShopItemsCart() {
    return this._http.get(environment.URL_BACKEND + '/shopping_car_item_numberV2')
      .subscribe((res: any) => {
        const itemsCount = res.items_car ?? res.items_cart ?? 0;
        this.itemsCart$.set(itemsCount);
      });
  }


}
