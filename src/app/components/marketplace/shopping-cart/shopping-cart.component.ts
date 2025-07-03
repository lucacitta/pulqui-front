import { Component, OnInit, ViewChild } from '@angular/core';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { BussinessStore } from '../../../shared/store/bussiness-store';
import { MatDialog } from '@angular/material/dialog';
import { ShopCart } from '../../../models/shop-cart.model';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { PurchaseSummaryComponent } from './components/purchase-summary/purchase-summary.component';
import { TrmService } from '../../../shared/services/trm/trm.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild('summary') summaryComponent!: PurchaseSummaryComponent;

  moneda_operacion: string = '';
  estado: number = 0;
  idUsuario: number = 0;
  fechaUpdateDoc!: Date;
  _itemList: any = [];
  estado_compra: number = 0;
  showResumen: boolean = true;
  isTrm: boolean = false;
  trm: any;
  selected = 0;
  facturas: any[] = [];
  renovaciones = [];
  _listFacturasSelected: number[] = [];
  loading: boolean = true;
  constructor(
    public _wlService: WishlistService,
    // public _carritoService: CompraEstadoService,
    private trmService: TrmService,
    private _dialog: MatDialog,
    public bussinesStore: BussinessStore,
    private authenticationService: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.estado = 1;
    this.authenticationService._user.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          this.idUsuario = user.idUsuario;
          this.moneda_operacion = user.currency;
          console.log('user', user);
          this.getShoppingList();
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  getShoppingList() {
    this._wlService.getShopCart(this.idUsuario).subscribe({
      next: async (res: ShopCart) => {
        console.log('viendo data', res);
        this.fechaUpdateDoc = new Date(res.fecha_actualizacion);
        const items_carro = res.items.filter(
          element => (element.renovacion == null || element.renovacion == 0) && element.idtbl_factura_renovacion === null
        );
        const items_renovacion = res.items.filter(element => element.renovacion != null && element.renovacion != 0);
        const items_factura = res.items.filter(element => element.idtbl_factura_renovacion !== null);

        this._itemList = items_carro;
        console.log(this._itemList.length);

        if (this._itemList.length === 0){
          this.showResumen = false;
          if(this.summaryComponent?.resumen_compra?.id_aplicado) this.summaryComponent.deleteCode();
        } 

        this.estado_compra = res.estado;
        // se deshabilita la consulta de la TRM
        if (this.isTrm) {
          if (this.trm && this.trm != 0) {
            this.calcularTotalMonedaOperacion();
            this.summaryComponent.getTotal();
          } else await this.getTRM();
        } else this.calcularTotalMonedaOperacionSinTrm();

        // Si es 3 se trae el actual soporte de factura
        if (this.estado_compra === 3) {
          this.summaryComponent.loadActualSupport();
        }

        // Gustavo: hay que ver esto que eta pasando
        localStorage.setItem('itemsShop', res.items.length.toString());
        this.bussinesStore.checkStatus();
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching shopping cart:', err);
      },
    });
  }
  async getTRM() {
    this.trm = await this.trmService.getTRM();
    this.calcularTotalMonedaOperacion();
    this.summaryComponent.getTotal();
  }
  calcularTotalMonedaOperacionSinTrm() {
    if (this._itemList && this._itemList.length > 0) {
      this._itemList.forEach((producto: any) => {
        producto.valor_base = this.calcularValorMonedaOperacion(producto.valor, producto.moneda);
        producto.valor = this.calcularValorMonedaOperacion(producto.valor, producto.moneda);
        producto.precio = producto.valor * producto.cantidad;
      });
      this.showResumen = true;
    }
  }
  itemEliminadoCarro(valor: boolean) {
    if (valor) {
      this.getShoppingList();
    }
  }
  itemApplyDiscount() {
    this.summaryComponent.calcularTotal();
  }
  actualizarListado(event: any = null, step: number = 0, changeTab: number = 0): void {
    this.getShoppingList();
    if (changeTab === 1) {
      this.selected = 0;
    }
  }
  /**
   * Function
   * Realiza la conversión del valor de los productos a la moneda de operacion establecida para el cliente.
   */
  calcularTotalMonedaOperacion(): void {
    if (!this.trm) return;

    const calcularValoresProducto = (producto: any) => {
      producto.valor_base = this.calcularValorMonedaOperacion(producto.valor_base, producto.moneda);
      producto.valor = this.calcularValorMonedaOperacion(producto.valor, producto.moneda);
      producto.precio = producto.valor * producto.cantidad * producto.periodos;
    };

    const calcularValoresRenovacion = (producto: any) => {
      producto.valor_base = this.calcularValorMonedaOperacion(producto.valor_base, producto.moneda);
      const valor = this.calcularValorMonedaOperacion(producto.valor, producto.moneda);
      const saldo_a_favor = producto.saldo_a_favor ?? 0;
      producto.valor_item = valor;
      producto.saldo_a_favor = this.calcularValorMonedaOperacion(saldo_a_favor, producto.moneda);
      producto.precio = valor * producto.cantidad * producto.periodos;

      if (this.moneda_operacion === 'ARS') {
        producto.valor_pesos = producto.precio;
      }
    };

    if (this._itemList?.length) {
      this._itemList.forEach(calcularValoresProducto);
    }

    if (this.renovaciones?.length) {
      this.renovaciones.forEach(calcularValoresRenovacion);
    }
  }
  calcularValorMonedaOperacion(valor_item: number, moneda: string): number {
    if (this.moneda_operacion === moneda) {
      return valor_item;
    }

    const factor_conversion = 1.0 / this.trm;

    if (this.moneda_operacion === 'COP' && moneda === 'USD') {
      return valor_item * this.trm;
    }

    if (this.moneda_operacion === 'USD' && moneda === 'COP') {
      return valor_item * factor_conversion;
    }

    // Si no coincide ninguna de las condiciones anteriores, retornamos el valor original
    return valor_item;
  }
}
