import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { TrmService } from '../../../shared/services/trm/trm.service';
import { CompraEstadoService } from '../../../shared/services/compra-estado/compra-estado.service';

import { PurchaseSummaryComponent } from '../shopping-cart/components/purchase-summary/purchase-summary.component';
import { Detalle } from '../../../models/factura.model';
import { Paquete } from '../../../models/paquete.model';

@Component({
  selector: 'app-compra-rapida',
  templateUrl: './compra-rapida.component.html',
  styleUrls: ['./compra-rapida.component.css'],
})
export class CompraRapidaComponent implements OnInit {
  @ViewChild('summary') purchaseSummaryComponent!: PurchaseSummaryComponent;

  // datos de estado
  estado = 0;
  estado_compra = 0;
  moneda_operacion = '';
  idUsuario = 0;
  loading = true;

  // listas y arrays
  dataSource = new MatTableDataSource<any>();
  facturas: any[] = [];
  _facturasEnCarro: any[] = [];
  renovaciones: Detalle[] = [];
  _itemList: any[] = [];
  _listFacturasSelected: number[] = [];

  // TRM y totales
  trm: number | null = null;
  totalEnvio = 0;

  // UI controls
  selectIndex = 0;
  transportePreferente = false;
  showBackButton = true;
  hijobtnCompra = false;
  hijobtnCompraUno = true;
  btnOcultarPrevious = false;
  ocultarBtnSiguiente = false;

  // datos intermedios para tabs
  datosDirecciones: any = {};
  datosDireccionesNotificar: any;
  provincias: any[] = [];
  localidades: any[] = [];
  paquetes: Paquete[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private wishlistService: WishlistService,
    private trmService: TrmService,
    private compraEstadoService: CompraEstadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProvincias();
    this.authenticationService._user.subscribe({
      next: (user) => {
        if (user?.idUsuario) {
          this.moneda_operacion = user.currency;
          this.idUsuario = user.idUsuario;
          this.getShoppingList();
        }
      },
      error: (err) => console.error('Error fetching user:', err),
    });
  }

  private cargarProvincias(): void {
    this.compraEstadoService.obtenerProvincia('AR').subscribe({
      next: (res: any[]) => (this.provincias = res),
      error: (err) => console.error('Error loading provinces:', err),
    });
  }

  private getShoppingList(): void {
    this.loading = true;
    this.wishlistService.getShopCart(this.idUsuario).subscribe({
      next: async (res) => {
        const items = res.items || [];
        // separar tipos
        const itemsCarro = items.filter(
          (i: { renovacion: any; idtbl_factura_renovacion: any }) =>
            !i.renovacion && !i.idtbl_factura_renovacion
        );
        const itemsRenov = items.filter(
          (i: { renovacion: any }) => i.renovacion
        );
        const itemsFac = items.filter(
          (i: { idtbl_factura_renovacion: any }) => i.idtbl_factura_renovacion
        );

        if (itemsFac.length) {
          this.convertirArrayFacturas(itemsFac);
        } else {
          this.getShoppingCarInvoiceList(false);
        }

        this.renovaciones = itemsRenov;
        this.purchaseSummaryComponent.limpiarRenovationList();
        this.renovaciones.forEach((el) =>
          this.purchaseSummaryComponent.addRen(el)
        );

        this._itemList = itemsCarro;
        this.estado_compra = res.estado;

        await this.ensureTRM();
        this.purchaseSummaryComponent.getTotal();

        if (this.estado_compra !== 0) {
          this.router.navigate(['/marketplace/shopping-cart']);
        }
        if (this.estado_compra === 3) {
          this.purchaseSummaryComponent.loadActualSupport();
        }

        localStorage.setItem('itemsShop', items.length.toString());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.loading = false;
      },
    });
  }

  private convertirArrayFacturas(items: any[]): void {
    const map = new Map<string, any>();
    items.forEach((item) => {
      if (!map.has(item.cons_factura_renovacion)) {
        map.set(item.cons_factura_renovacion, {
          cons_factura_renovacion: item.cons_factura_renovacion,
          trm: item.trm,
          fecha_vigencia: item.fecha_vigencia,
          cons_carro_compra: item.cons_carro_compra,
          detalle: [],
        });
      }
      map.get(item.cons_factura_renovacion).detalle.push(item);
    });
    map.forEach((fac) => {
      this.facturas.push(fac);
      this.purchaseSummaryComponent.addFactura(fac);
    });
  }

  private getShoppingCarInvoiceList(cargar: boolean): void {
    this.wishlistService.getShopCartInvoice(this.idUsuario, 0).subscribe({
      next: (res) => {
        if (res.items?.length) {
          if (cargar) this.convertirArrayFacturas(res.items);
          this._facturasEnCarro = res.items;
        }
        this.purchaseSummaryComponent.getTotal();
      },
      error: (err) => console.error('Error loading invoices:', err),
    });
  }

  private async ensureTRM(): Promise<void> {
    if (!this.trm) {
      this.trm = await this.trmService.getTRM();
    }
    this.purchaseSummaryComponent.getTotal();
  }

  transportePreferenteEmit(value: boolean): void {
    this.transportePreferente = value;
  }

  nextTabs(event: any, step: number): void {
    this.datosDirecciones = event;
    this.loading = true;
    this.selectIndex++;

    // Esto lo hacés SIEMPRE, en cualquier paso
    this.btnOcultarPrevious = this.selectIndex >= 1;
    this.ocultarBtnSiguiente = this.selectIndex <= 1;

    // Paso 2 = tab 3 = método de envío
    if (step === 2) {
      this.compraEstadoService.direccionCarro(this.datosDirecciones).subscribe({
        next: () => {
          this.datosDireccionesNotificar = this.datosDirecciones;

          // 👇 agregás esto para que siga el flujo
          // aunque el método de envío tenga su propio loading, esto activa el tab
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  btnAtras(): void {
    this.selectIndex--;
    this.btnOcultarPrevious = this.selectIndex >= 1;
    this.ocultarBtnSiguiente = this.selectIndex <= 1;
    this.paquetes = [];
    this.purchaseSummaryComponent.obtenerResumenCompra();
  }

  cambiarEnvio(e: Paquete[]): void {
    this.paquetes = e;
  }

  actualizarListado(
    event: any = null,
    step: number = 0,
    changeTab: boolean = false
  ): void {
    console.log('reportChange event:', event);
    if (event === 0) {
      this.showBackButton = false;
    }
    this.getShoppingList();
    if (changeTab) {
      this.selectIndex = 0;
      this.hijobtnCompra = false;
    }
  }

  finalizar(): void {
    this.hijobtnCompra = true;
  }
}
