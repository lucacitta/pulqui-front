import { Component, OnInit, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { StoresCompleteService } from './stores-complete.service';

@Component({
  selector: 'app-stores-complete',
  templateUrl: './stores-complete.component.html',
  styleUrls: ['./stores-complete.component.scss']
})
export class StoresCompleteComponent implements OnInit {

  items = signal<any[]>([]);
  idUsuario:any;
  cellAmount=5;
  image="https://dummyimage.com/600x400/000/fff";

  @Input() title: string = '';

  constructor(
    private _productService: ProductService,
    private _storesService: StoresCompleteService,
    private _authenticationService: AuthenticationService,
    private router: Router
  ) { 

  }

  ngOnInit() {
    this.getPromos();
    if(window.innerWidth<769){
      this.cellAmount=3
    }
    if(window.innerWidth<600){
      this.cellAmount=1
    }
  }

  openStore(item: any){
    this.router.navigate(['marketplace/products'], {
      queryParams: {
        stores: item.cons_cliente
      }
    });
  }

  getPromos(){
    this._storesService.getTiendas().subscribe((data: any) => {
      this.items.set(data);
    });
  }
}
