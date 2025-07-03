import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WishlistService } from '../../../../../shared/services/wishlist.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UdcService } from '../../../../udc/services/udc.service';
import { AdministradorService } from '../../../../../shared/services/administrador/administrador.service';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { Color } from '../../../../../models/colors.model';
import { firstValueFrom, take } from 'rxjs';
import { Talla } from '../../interfaces/talla.interface';

import { ProductModalContinueComponent } from '../product-modal-continue/product-modal-continue.component';
import { FechaReference } from '../../../../../models/fecha-reference';
import { ProductModalFechasComponent } from '../product-modal-fechas/product-modal-fechas.component';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart/shopping-cart.service';
import { HeaderService } from '../../../../../layout/header/header.service';

const ORDEN_TALLAS: { [key: string]: number } = {
  xxs: 1,
  xs: 2,
  s: 3,
  m: 4,
  l: 5,
  xl: 6,
  xxl: 7,
  '2xl': 8,
  '3xl': 9,
  '4xl': 10,
  '5xl': 11,
  '6xl': 12,
  '7xl': 13,
};

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent implements OnInit {

  @Output() change = new EventEmitter<void>();
  showStock: boolean = false;
  tallas: any;
  arTallas: any[] = [];
  colorList: any;
  stock: { [key: string]: number } = {};
  depreciados: { [key: string]: boolean } = {};
  cons_productos: { [key: string]: number } = {};
  columns: number = 5;
  colorColumns: number = 2;
  colorSelect: string = '';
  colorsSelect: any[] = [];
  itemsFechas: any[] = [];
  idProductoActualizar: number = 0;
  editar: boolean = false;
  curvaSelececionada: string = '';
  disableSelect: boolean = false;
  idUsuario: number = 0;
  userIsStock: boolean = false;
  productoSinStock: boolean = false;
  tallasForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _wlService: WishlistService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _udcServices: UdcService,
    private _administradorService: AdministradorService,
    private _dialog: MatDialog,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private headerService: HeaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.idUsuario = JSON.parse(currentUser).idUsuario;
    } else {
      console.error('No se encontró el usuario actual en el localStorage');
      this.idUsuario = -1;
    }
    // Ver para que funcioona
    this.authService.rolePermit(this.idUsuario, 'v_stock').subscribe(res => {
      this.userIsStock = res;
    });

    this.productoSinStock = this.data.venta_sin_stock_out;
    this.tallas = await this.obtenerListado('00T', 'TL');
    console.log('tallas', this.tallas);

    this.tallasForm = this.fb.group({
      tallas: this.fb.array([]),
      colors: this.fb.array([]),
    });
    this.idProductoActualizar = this.data.cons_producto;
    if (this.idProductoActualizar) {
      this.editar = true;
      if (this.data.curva_padre != null) {
        this.curvaSelececionada = this.data.curva_padre;
        this.disableSelect = true;
        try {
          await this.onTallaChange();
          const colores = this.data.colors.filter((color: Color) => color.select);
          for (const color of colores) {
            await this.addColors(color);
          }
          this.cargarValores();
        } catch (err) {
          console.error('Error al cambiar la talla:', err);
        }
      }else{
        this._snackBar.open('El producto no tiene variantes configuradas.', 'Ok', { duration: 3000 });
        this.dialogRef.close();
      }
    }
  }

  cargarValores(): void {
    this._administradorService
      .obtenerProductosbyReferencia(this.idUsuario, this.data.reference)
      .pipe(take(1))
      .subscribe(res => {
        const result = res[0];
        result.forEach((producto: any) => {
          this.colorsForm?.value.forEach((_: any, i: number) => {
            const control = this.colorsForm?.get(`${i}`)?.get(producto.referencia);
            if (control) {
              this.stock[producto.referencia] = producto.available_stock;
              this.depreciados[producto.referencia] = producto.depreciado;
              this.cons_productos[producto.referencia] = producto.cons_producto;
            }
          });
        });
      });
  }

  get colorsForm(): FormArray {
    return this.tallasForm.get('colors') as FormArray;
  }

  get tallaForm(): FormArray {
    return this.tallasForm.get('tallas') as FormArray;
  }

  async addColors(color: any): Promise<void> {
    const cons_codigo = color.cod;
    this.colorColumns++;
    this.colorSelect = cons_codigo;
    this.colorsSelect.push(color);
    const group: { [key: string]: FormControl } = {};
    this.arTallas.forEach((input_template: any) => {
      group[`${this.data.reference}-${cons_codigo}-${input_template.cons_codigo}`] = new FormControl({
        value: '',
        disabled: false,
      });
    });
    this.colorsForm.push(this.fb.group(group));
  }

  async addTalla(): Promise<void> {
    const group: { [key: string]: FormControl } = {};
    const DEFAULT_ORDER = 13;

    console.log('Ordenando arTallas:', this.arTallas);

    this.arTallas.sort((a: Talla, b: Talla) => {
      const primeraTalla = !isNaN(Number(a.cons_codigo))
        ? Number(a.cons_codigo)
        : ORDEN_TALLAS[a.cons_codigo.toLowerCase()] ?? DEFAULT_ORDER;
      const segundaTalla = !isNaN(Number(b.cons_codigo))
        ? Number(b.cons_codigo)
        : ORDEN_TALLAS[b.cons_codigo.toLowerCase()] ?? DEFAULT_ORDER;

      return primeraTalla - segundaTalla;
    });

    console.log('arTallas ordenadas:', this.arTallas);

    this.arTallas.forEach((input_template: Talla) => {
      group[input_template.cons_codigo] = new FormControl({ value: input_template.cons_codigo, disabled: false });
    });

    console.log('Group creado:', group);

    const tallas = this.fb.group(group);
    this.tallaForm.push(tallas);

    console.log('tallaForm actualizado:', this.tallaForm);
  }

  obtenerListado(cons_codigo_producto: string, cons_codigo_definido_usuario: string): Promise<any> {
    const obj = {
      cons_codigo_producto,
      cons_codigo_definido_usuario,
    };
    return firstValueFrom(this._udcServices.obtenerDetalleUDC(obj));
  }

  async onTallaChange(): Promise<void> {
    this.colorsForm.clear();
    this.tallaForm.clear();
    this.colorsSelect.length = 0;

    try {
      this.colorList = await this.obtenerListado('00C', 'CL');
      this.arTallas = await this.obtenerListado('00T', this.curvaSelececionada);
      await this.addTalla();
      this.showStock = true;
    } catch (err) {
      console.error(err);
      this.showStock = true;
      throw err;
    }
  }

  onKeydown($event: FocusEvent, maxLength: number, value: string, position: number): void {
    console.log('onKeydown --->>>', this.productoSinStock, this.userIsStock, this.depreciados, this.depreciados[value]);
    if (this.productoSinStock && this.userIsStock && !this.depreciados[value]) {
      return;
    }
    const control = this.colorsForm.get(`${position}`)?.get(`${value}`);
    if (!control) {
      console.error(`Control not found for position: ${position}, value: ${value}`);
      return;
    }
    if (maxLength < 0) {
      control.setValue(0);
      this._snackBar.open('Sin disponibilidad', 'ok', { duration: 3000 });
      return;
    }
    const inputValue = Number(($event.target as HTMLInputElement).value);
    if (inputValue > maxLength) {
      control.setValue(maxLength);
      this._snackBar.open(`La cantidad máxima permitida es de ${maxLength}`, 'ok', { duration: 3000 });
    }
  }

  confirmarCarrito(dataSend: any): void {
    console.log('Datos enviados:', dataSend); // Ver los datos enviados

    if (dataSend.items_sin_stock) {
      dataSend.items_sin_stock.forEach((item: any) => {
        item.fecha_entrega = item.fecha_exacta;
      });
    }

    this._wlService.addCartItems(dataSend, this.data.cons_cliente_out).subscribe(res => {
      console.log('Respuesta del servidor:', res); // Ver la respuesta del servidor

      if (res.code === '200') {
        this._snackBar.open(res.msg, 'ok', { duration: 5000 });
        //this.shoppingCartService.addItemToCart(); // Actualizar el carrito de compras
        this.headerService.getShopItemsCart();

        console.log('Carrito actualizado'); // Confirmar que el carrito se actualizó
      } else {
        this._snackBar.open(res.msg, 'error', { duration: 3000 });
      }
    });

    const dialogRef = this._dialog.open(ProductModalContinueComponent, {
      width: '50vw',
      height: 'auto',
      maxWidth: '50vw',
    });

    dialogRef.afterClosed().subscribe(() => console.log('Cerrar Modal Producto Compra'));
  }
  get tallasControls() {
    return (this.tallasForm.get('tallas') as FormArray).controls;
  }
  changeEvent(e: any, num: any) {
    // console.log(e,num);
  }
  stockItem(indice: number, input: any): string {
    const cantidadEnStock = this.stock[`${this.data.reference}-${this.colorsSelect[indice].cod}-${input.cons_codigo}`];
    return cantidadEnStock > 50 ? '+ 50 en Stock' : cantidadEnStock > 0 ? `${cantidadEnStock} en Stock` : 'Sin disponibilidad';
  }
  next(): void {
    const coloresSeleccionados = this.colorsSelect;
    let { tallas, colors: cantidades } = this.tallasForm.value;
    const valuesTallas = Object.values(tallas[0]);
    const dataItems: any[] = [];
    let stockSuperados = false;

    let cantidadTotalSolicitada = 0;
    cantidades.forEach((cantidad: any) => {
      for (const key in cantidad) {
        const cantidadSolicitada = Number(cantidad[key]);
        if (Object.prototype.hasOwnProperty.call(cantidad, key) && !isNaN(cantidadSolicitada)) {
          cantidadTotalSolicitada += cantidadSolicitada;
        }
      }
    });

    if (cantidadTotalSolicitada < this.data.cantMin) {
      const horizontalPosition: MatSnackBarHorizontalPosition = 'end';
      const verticalPosition: MatSnackBarVerticalPosition = 'top';

      const config: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
      };

      this._snackBar.open(`El mínimo de productos permitido es de ${this.data.cantMin}`, 'Cerrar', config);
      return;
    }

    coloresSeleccionados.forEach((color, index) => {
      valuesTallas.forEach(talla => {
        const reference = `${this.data.reference}-${color.cod}-${talla}`;
        const quantityProducts = cantidades[index][reference] > 0 ? +cantidades[index][reference] : 0;
        if (quantityProducts !== 0) {
          if (quantityProducts > this.stock[reference]) {
            stockSuperados = true;
          }
          const jsonItem = {
            reference,
            user: this.idUsuario,
            quantity: quantityProducts,
            invoice_apply: 0,
            status: 0,
            terms: 0,
            list_status: 1,
            purchase_status: 1,
            trm_value: 0.0,
            positive_balance: 0.0,
            superado: quantityProducts > this.stock[reference],
          };
          dataItems.push(jsonItem);
        }
      });
    });

    if (stockSuperados) {
      const dataItems2 = dataItems
        .filter(item => item.superado)
        .map(item => ({
          cons_producto: this.cons_productos[item.reference],
          cantidad: item.quantity,
          reference: item.reference,
        }));

      this._wlService.calcularStocks(dataItems2).subscribe(res => {
        const data1: { fechas: FechaReference[] } = { fechas: [] };
        const respuestStocks = res.data?.[0]?.productos_fechas_out ? JSON.parse(res.data[0].productos_fechas_out) : [];
        respuestStocks.forEach((it: any) => {
          dataItems2.forEach((jt: any) => {
            if (it.cons_producto === jt.cons_producto) {
              data1.fechas.push({
                fecha: it.fecha_exacta,
                reference: jt.reference,
              });
            }
          });
        });

        const dialogRef = this._dialog.open(ProductModalFechasComponent, {
          width: '300px',
          height: 'auto',
          maxWidth: '50%',
          data: data1,
        });

        dialogRef.afterClosed().subscribe(resModal => {
          if (resModal) {
            const dataSend = {
              items_lista: dataItems,
              items_sin_stock: JSON.parse(res.data[0].productos_fechas_out),
            };
            this.confirmarCarrito(dataSend);
            this.dialogRef.close();
          }
        });
      });
    } else {
      this.dialogRef.close();
      const dataSend = {
        items_lista: dataItems,
        items_sin_stock: null,
      };
      this.confirmarCarrito(dataSend);
    }
  }

  toggleModal(): void {
    this.dialogRef.close();
  }
}
