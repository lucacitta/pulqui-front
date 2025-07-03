import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishlistService } from '../../../../../shared/services/wishlist.service';
import { combineLatest, take } from 'rxjs';
import { CodigosService } from '../../../../../shared/services/codigos/codigos.service';
import { CodigoDescuento } from '../../../../../models/codigo-descuento.model';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { HeaderService } from '../../../../../layout/header/header.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit {
  @Input() estado_compra: number = 0;

  @Input()
  set items(products: any[]) {
    this._items = products;
    if (this._items && this._items.length > 0) {
      this.isCarroComercial = this._items[0].carro_appcomercial;
    }
  }
  @Input()
  set trm(value: number) {
    if (value) {
      this._trm = value;
    }
  }
  @Output() itemEliminado: EventEmitter<boolean> = new EventEmitter();
  @Output() itemDiscount: EventEmitter<any> = new EventEmitter();
  _items: any[] = [];
  _trm: number = 0;
  isCarroComercial: boolean = false;
  client: any;
  moneda_operacion: string = '';

  constructor(
    private _wlService: WishlistService,
    private snackBar: MatSnackBar,
    private codigosService: CodigosService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    public router: Router,
    private headerService: HeaderService
  ) {
    this.client = this.authenticationService._user.getValue();
    this.getCodes();
    console.log('Usre carrito', this.client);
    this.authenticationService.user$.subscribe((value) => {
      console.log('User carrito Subscribe', value);
      this.client = value;
    })
  }
  ngOnInit(): void {
    this.authenticationService._user.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          console.log(user);
          this.client = user.client_id;
          this.getCodes();
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  eliminarProductoCarro(producto: any): void {
    const snackBarRef = this.snackBar.open('¿Deseas eliminar este producto del carro de compras?', 'Eliminar', {
      duration: 5000,
      panelClass: ['snack-bar-warning'],
    });
    snackBarRef.onAction().subscribe(() => {
      this._wlService
        .deleteProductOfCart(producto.cons_item_lista)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.itemEliminado.emit(true);
            this.snackBar.open('Producto eliminado del carro de compras.', 'Cerrar', {
              duration: 3000,
              panelClass: ['snack-bar-success'],
            });
            this.headerService.getShopItemsCart();
          },
          error: err => {
            console.error(err);
            this.snackBar.open('Ocurrió un error al eliminar el producto del carro de compras.', 'Cerrar', {
              duration: 3000,
              panelClass: ['snack-bar-error'],
            });
          },
        });
    });
  }
  async getCodes() {
    this.codigosService.getUserCodigos(this.client).subscribe({
      next: (res: CodigoDescuento[]) => {
        console.log('codigo', res);
        res.forEach(element => {
          if (element.cons_producto && element.vigente === 1) {
            this.items.forEach(i => {
              if (i.cons_producto === element.cons_producto) {
                i.discount = element.porcentaje;
              }
            });
          }
        });
      },
      error: error => {
        console.error(error);
      },
    });
  }
  dropCart() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '¿Estás seguro?',
        message: '¿Deseas vaciar el carro de compras?',
        confirmText: 'Si, eliminar',
        cancelText: '¡No, cancelar!',
      },
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result === true) {
          combineLatest(
            this._items.map(item => this._wlService.deleteProductOfCart(item.cons_item_lista).pipe(take(1)))
          ).subscribe({
            next: () => {
              this.itemEliminado.emit(true);
              this.snackBar.open('Carro de compras vaciado exitosamente.', 'Cerrar', {
                duration: 3000,
                panelClass: ['snack-bar-success'],
              });
              this.headerService.getShopItemsCart();
            },
            error: err => {
              console.log(err);
              this.snackBar.open('Ocurrió un error al vaciar el carro de compras.', 'Cerrar', {
                duration: 3000,
                panelClass: ['snack-bar-error'],
              });
            },
          });
        }
      },
      error: err => {
        console.log(err);
        this.snackBar.open('Ocurrió un error al abrir el diálogo de confirmación.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-error'],
        });
      },
    });
  }
  abrirProducto(item: any) {
    console.log(item);
    // Producto Prueba
    this.router.navigate(['/marketplace/producto/' + item.cons_producto_padre]);
  }
  addDiscount(event: any, item: any, discount: number): void {
    if (event.checked) {
      const discountAmount = (item.valor / 100) * discount;
      item.valor -= discountAmount;
    } else {
      item.valor = item.precio;
    }
    this.itemDiscount.emit({ item, discountApplied: event.checked });
  }
}
