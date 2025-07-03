import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarketplaceRoutingModule } from './marketplace-routing.module';

import { ProductGalleryComponent } from './products/components/product-gallery/product-gallery.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { ProductsComponent } from './products/products.component';
import { TextoCortoPipe } from './pipes/texto-corto.pipe';
import { ProductModalContinueComponent } from './products/components/product-modal-continue/product-modal-continue.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductModalComponent } from './products/components/product-modal/product-modal.component';
import { ProductSettingsComponent } from './products/components/product-settings/product-settings.component';
import { StoresCompleteComponent } from './stores-complete/stores-complete.component';
import { CategoryComponent } from './category/category.component';
import { MatSelectModule } from '@angular/material/select';
import { GridProductsComponent } from './grid-products/grid-products.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductFilterComponent } from './category/product-filter/product-filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductModalFechasComponent } from './products/components/product-modal-fechas/product-modal-fechas.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingListComponent } from './shopping-cart/components/shopping-list/shopping-list.component';
import { PurchaseSummaryComponent } from './shopping-cart/components/purchase-summary/purchase-summary.component';
import { CompraRapidaComponent } from './compra-rapida/compra-rapida.component';
import { DireccionEnvioComponent } from './compra-rapida/components/direccion-envio/direccion-envio.component';
import { DireccionFacturacionComponent } from './compra-rapida/components/direccion-facturacion/direccion-facturacion.component';
import { MetodoEnvioComponent } from './compra-rapida/components/metodo-envio/metodo-envio.component';
import { MediosPagoComponent } from './accion-pago/components/medios-pago/medios-pago.component';
import { RespuestaPagoComponent } from './respuesta-pago/respuesta-pago.component';
import { ProductLicensesComponent } from './products/components/product-licenses/product-licenses.component';
import { DialogTerminosCondicionesComponent } from './accion-pago/components/dialog-terminos-condiciones/dialog-terminos-condiciones.component';
import { ProductoCalificacionComponent } from './products/components/producto-calificacion/producto-calificacion.component';
import { ComentariosComponent } from './products/components/comentarios/comentarios.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    ProductGalleryComponent,
    ProductModalComponent,
    ProductsComponent,
    TextoCortoPipe,
    ProductSettingsComponent,
    StoresCompleteComponent,
    CategoryComponent,
    ProductModalContinueComponent,
    ProductModalFechasComponent,
    ShoppingCartComponent,
    ShoppingListComponent,
    PurchaseSummaryComponent,
    CompraRapidaComponent,
    DireccionEnvioComponent,
    DireccionFacturacionComponent,
    MetodoEnvioComponent,
    MediosPagoComponent,
    ProductFilterComponent,
    RespuestaPagoComponent,
    ProductLicensesComponent,
    DialogTerminosCondicionesComponent,
    ProductoCalificacionComponent,
    ComentariosComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    MarketplaceRoutingModule,
    PinchZoomModule,
    MatSelectModule,
    GridProductsComponent,
    MatSidenavModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [ProductGalleryComponent, ProductModalComponent],
})
export class MarketplaceModule { }
