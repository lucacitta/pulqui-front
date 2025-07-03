import { Injectable } from '@angular/core';
import { Store } from './store';
import { AuthService } from '../services/auth/auth.service';

export interface Bussiness {
  representante: boolean;
  shoppingCart: boolean;
  haveBusiness: boolean;
  completedProfile: boolean;
  items: number;
}

@Injectable()
export class BussinessStore extends Store<Bussiness> {
  constructor(private service: AuthService) {
    super({
      representante: true,
      shoppingCart: true,
      haveBusiness: service.haveBussiness(),
      completedProfile: service.completedProfile(),
      items: service.checkItemsShop(),
    });
  }

  setStatus(): void {
    this.setState({
      representante: true,
      shoppingCart: true,
      haveBusiness: true,
      completedProfile: this.service.completedProfile(),
      items: this.service.checkItemsShop(),
    });
  }
  checkStatus(): void {
    this.setState({
      representante: true,
      // shoppingCart: this.service.shoppingCartPermit(),
      shoppingCart: true,
      haveBusiness: this.service.haveBussiness(),
      completedProfile: this.service.completedProfile(),
      items: this.service.checkItemsShop(),
    });
  }
  clearStatus(): void {
    this.setState({
      representante: false,
      shoppingCart: false,
      haveBusiness: false,
      completedProfile: false,
      items: 0,
    });
  }
}
