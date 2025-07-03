import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { PayMethod } from '../../../../../models/paymethod.model';
import { WishlistService } from '../../../../../shared/services/wishlist.service';
import { ToastService } from '../../../../../shared/services/toasts/toast.service';
import { Color } from '../../../../../models/colors.model';
import { take } from 'rxjs';
import { ProductLicensesComponent } from '../product-licenses/product-licenses.component';
import { ResponseDialogProductLicenses } from '../../interfaces/response-dialog-product-licenses';
import { JsonItem } from '../../interfaces/json-item.interface';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';

export interface productData {
  seleccion: any;
  idProduct: any;
  product: any;
  name: string;
  id: number;
}
@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrl: './product-settings.component.css',
})
export class ProductSettingsComponent implements OnInit {
  @Input() payMethods: PayMethod[] = [];
  @Input() dataProduct: any;
  @Input() idProduct: any;
  @Input() colors!: any[];
  initPrice = 0;
  initPeriodo = '';
  selectPlan: any;
  selectPeriodos: any;
  selectCantidad: any;
  formComplejo!: FormGroup;
  formaItem!: FormGroup;
  id_list: any;
  listControl = new FormControl('', [Validators.required]);
  idUsuario!: number;
  data!: productData;
  cant = new FormControl('', [Validators.required, Validators.maxLength(2)]);
  noLog = true;
  isDialogOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    public _wlService: WishlistService,
    private readonly toast: ToastService,
    // public bussinesStore: BussinessStore,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _router: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.authenticationService._user.subscribe({
      next: user => {
        this.idUsuario = user?.idUsuario??null;
        if (this.idUsuario) {
          this.noLog = false;
        }
        this.data = {
          seleccion: this.payMethods[0] ? this.payMethods[0].cons_per_pago_producto : null,
          idProduct: this.idProduct,
          product: this.dataProduct,
          name: this.dataProduct.name,
          id: this.idProduct,
        };
        this.selectPlan = this.payMethods[0];
        this.formComplejo = new FormGroup({
          descripcion: new FormControl(null, [Validators.required]),
        });
        this.formaItem = this.fb.group({
          plan: [this.data.seleccion, Validators.required],
          cantidad: [null, Validators.compose([Validators.required, Validators.pattern(/^([1-9])?[0-9]$/)])],
          period: [1, Validators.compose([Validators.required, Validators.pattern(/^([1-9])?[0-9]$/)])],
        });
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }
  openDialogColor(): void {
    if (this.isDialogOpen) {
      return;
    }

    this.isDialogOpen = true;

    // Asignar los colores del producto
    this.dataProduct.colors = this.colors;

    // Verificar si algún color está seleccionado
    let selected = this.dataProduct.colors.some((color: Color) => color.select);

    // Si no hay colores, marcar como seleccionado
    if (!this.dataProduct.colors.length) {
      selected = true;
    }

    if (selected) {
      this._wlService.getShopCartStore().subscribe((res: any) => {
        const cartHasProducts = res.data && res.data.length > 0;
        const carAdmitAddProducts = cartHasProducts && res.data[0].estado === 0;
        const sameStore = cartHasProducts && res.data[0].cons_cliente === this.dataProduct.cons_cliente_out;
        const isValid = this.validateAddItem(cartHasProducts, sameStore, carAdmitAddProducts);

        if (isValid) {
          const dialogRef = this._dialog.open(ProductModalComponent, {
            width: '40vw',
            height: 'auto',
            maxWidth: '90vw',
            data: this.dataProduct,
          });
          dialogRef.afterClosed().subscribe(() => {
            this.isDialogOpen = false;
          });
        }else{
          this.isDialogOpen = false;
        }
      });
    } else {
      const config = new MatSnackBarConfig();
      config.data = {
        message: 'Debe seleccionar colores de producto.',
      };
      config.duration = 5000;
      config.panelClass = ['custom-toast'];
      config.horizontalPosition = 'end';
      config.verticalPosition = 'top';

      this._snackBar.open('Debe seleccionar colores de producto.', 'OK', config);
      this.isDialogOpen = false;
    }
  }

  validateAddItem(cartHasProducts: boolean, sameStore: boolean, carAdmitAddProducts: boolean){
    let isValid = false;
    if(!cartHasProducts){
      isValid=true;
      return isValid;
    }

    if(!(cartHasProducts && carAdmitAddProducts)){
      isValid=false;
      this._snackBar.open(
        'Tiene un proceso de compra en curso, debe finalizarlo para añadir al carrito nuevamente',
        'OK',
        {
          duration: 5000,
        }
      );
      return isValid;
    }else{
      isValid=true;
    }

    if(!(cartHasProducts && sameStore)){
      isValid = false;
      this._snackBar.open(
        'Se encuentra seleccionando un producto de una tienda distinta al que ya tiene en su carrito, debe finalizar la compra o eliminar los productos que tiene en el carrito.',
        'OK',
        {
          duration: 5000,
        }
      );
      return isValid;
    }else{
      isValid=true;
      return isValid;
    }
  }

  addItem(redirect: boolean): void {
    if (this.data.product.tipo_producto === 1 && this.formComplejo.invalid) {
      return;
    } else if (this.data.product.tipo_producto !== 1 && this.formaItem.invalid) {
      return;
    }

    let idCurrentList = this.id_list || this.data.id;
    if (this.data.seleccion && this.listControl.value !== '') {
      idCurrentList = this.listControl.value;
    }

    const jsonItem: JsonItem =
      this.data.product.tipo_producto === 1
        ? {
            product: parseInt(this.data.idProduct, 10),
            list: idCurrentList,
            quantity: 0,
            period: 0,
            product_type: 1,
            need: this.formComplejo.value.descripcion,
          }
        : {
            product: parseInt(this.data.idProduct, 10),
            list: idCurrentList,
            quantity: parseInt(this.formaItem.value.cantidad, 10),
            period: this.formaItem.value.plan,
            product_type: 0,
            need: '',
            number_period: this.formaItem.value.period,
            usuario: this.idUsuario,
          };

    this._wlService
      .getProrrateoProduct(
        parseInt(this.formaItem.value.cantidad, 10),
        this.formaItem.value.plan,
        parseInt(this.data.idProduct, 10),
        this.idUsuario
      )
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result && result[0] && result[0].aplica === 1) {
          this._dialog
            .open(ProductLicensesComponent, {
              width: '600px',
              data: {
                title: '¡Atención!',
                message: `Ya cuentas con una licencia activa de este producto que expira: ${result[0].fecha_terminacion},
                      el valor de la licencia adicional será de ${result[0].valor_licencia}${result[0].moneda}
                      ¿Deseas adicionar la licencia al plan actual?`,
                confirmButtonText: 'Si, quiero adicionar',
                cancelButtonText: '¡No, cancelar!',
              },
            })
            .afterClosed()
            .subscribe((responseDialog: ResponseDialogProductLicenses) => {
              if (responseDialog && responseDialog.value) {
                this._wlService
                  .createrenewAgreement({
                    usuario: this.idUsuario,
                    cons_item_lista: result[0].cons_item_lista_anterior,
                    cons_producto: null,
                    cantidad: jsonItem.quantity,
                    tipo_lista: 3,
                    cons_tipo_solicitud: 'IPC',
                    valor_prorrateo: result[0].valor_licencia,
                    saldo_a_favor: null,
                    fecha_activacion: responseDialog.fecha.toISOString().split('T')[0],
                    periodo: jsonItem.number_period,
                  })
                  .pipe(take(1))
                  .subscribe(res => {
                    if (redirect) {
                      this.router.navigate(['/marketplace2/compra_actual']);
                    }
                    this.openSnackBar('Producto añadido al carrito', 'ok');
                  });
              }
            });
        } else {
          this.addItemCar(jsonItem, redirect);
        }
      });
  }

  addItemCar(jsonItem: JsonItem, redirect: boolean): void {
    this._wlService.addItemList(jsonItem).subscribe((res: any) => {
      if (res.code === 200) {
        // 2020-09-21 Agregar items a compras
        const actualItems = this._wlService.checkItemsShop();
        this._wlService.updateItemsSho(actualItems + 1);
        // this.bussinesStore.checkStatus();
        if (redirect) {
          this.router.navigate(['/marketplace2/compra_actual']);
        }
        this.openSnackBar('Producto añadido al carrito', 'ok');
      } else {
        this.openSnackBar(res.msg, 'ok');
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
