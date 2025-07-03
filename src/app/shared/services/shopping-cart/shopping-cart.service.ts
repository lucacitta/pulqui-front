import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { WishlistService } from '../wishlist.service';
import { BussinessStore } from '../../store/bussiness-store';
import { ShopCart } from '../../../models/shop-cart.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  // itemsShop$ = this._itemsShopSubject.asObservable();
  itemsCart$ = signal<number>(0);
  itemsCart1$ = signal(null);


  constructor(
    // private serviceShop: WishlistService,
    // private bussinesStore: BussinessStore,
    public _http: HttpClient
  ) { }

  // get userData$() {
  //   return this._itemsShopSubject.asObservable();
  // }
  // set userData(value: number) {
  //   this._itemsShopSubject.next(value);
  // }
  // initializeCart(): void {
  //   this._itemsShopSubject.next(0);
  // }

  // clearCart(): void {
  //   this._itemsShopSubject.next(0);
  // }

  // getShoppingCart(): void {
  //   const currentUser = localStorage.getItem('currentUser');
  //   const idUsuario = currentUser ? JSON.parse(currentUser)?.idUsuario : null;
  //   if (!idUsuario) {
  //     this._itemsShopSubject.next(0);
  //     return;
  //   }
  //   this.serviceShop
  //     .getShopCart(idUsuario)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (res: ShopCart) => {
  //         console.log('Respuesta del carrito de compras:', res); // Ver la respuesta del carrito de compras
  //         this._itemsShopSubject.next(res.items.length);
  //         this.bussinesStore.checkStatus();
  //       },
  //       error: err => {
  //         console.log('Error al obtener el carrito de compras:', err); // Ver el error si ocurre
  //         this._itemsShopSubject.next(0);
  //         this.bussinesStore.checkStatus();
  //       },
  //     });
  // }

  // addItemToCart(): void {
  //   const currentCount = this._itemsShopSubject.value;
  //   this._itemsShopSubject.next(currentCount + 1);
  // }


  getShopItemsCart() {
    return this._http.get(environment.URL_BACKEND + '/shopping_car_item_numberV2')
      .subscribe((res: any) => {
        console.log("Cart: ", res.items_cart);
      });
  }
}
