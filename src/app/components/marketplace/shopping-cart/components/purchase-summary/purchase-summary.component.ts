import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '../../../../../models/item-product.model';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { CodigosService } from '../../../../../shared/services/codigos/codigos.service';
import { CodigoDescuento } from '../../../../../models/codigo-descuento.model';
import moment from 'moment';
import { DescuentoAplicado } from '../../../../../models/descuento-aplicado.mode';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogTerminosCondicionesComponent } from '../../../accion-pago/components/dialog-terminos-condiciones/dialog-terminos-condiciones.component';
import { WishlistService } from '../../../../../shared/services/wishlist.service';
import { take } from 'rxjs';
import { DiscountInfo } from '../../../../../models/discount-info.model';
import { DocumentsService } from '../../../../../shared/services/documents/documents.service';
import { Detalle, Factura } from '../../../../../models/factura.model';
import { Parametros } from '../../../../../models/parametros.model';
import { Router } from '@angular/router';
import { CompraEstadoService } from '../../../../../shared/services/compra-estado/compra-estado.service';
import { AccionPagoService } from '../../../accion-pago/services/accion-pago.service';
import { DatosPagoModel, UsuarioModel } from '../../../accion-pago/interfaces/datos-pago';
import { MediosPagoComponent } from '../../../accion-pago/components/medios-pago/medios-pago.component';
import { CotizacionService } from '../../../../../shared/services/cotizacion/cotizacion.service';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSelectionListChange } from '@angular/material/list';
import { Paquete } from '../../../../../models/paquete.model';
@Component({
  selector: 'app-purchase-summary',
  templateUrl: './purchase-summary.component.html',
  styleUrls: ['./purchase-sumary.component.css'],
})
export class PurchaseSummaryComponent implements OnInit, OnChanges {
  @Input() trm: any = null;
  @Input() mostrarButon: boolean = false;
  @Input() mostrarButonUno: boolean = true;
  @Input() _facturasList: any[] = [];
  @Input() estado_compra: any = null;
  @Input() estado: any = null;
  @Input() _listFacturasSelected: any[] = [];
  @Input() totalEnvio: number = 0;
  @Input() paquetes: Paquete[] = [];
  @Output() reportChange: EventEmitter<number> = new EventEmitter();
  //New properties
  //Used to control the behavior of buttons based on where is invoked.
  //Unique two values: 'shopping-cart' or 'quick-buy'
  @Input() used_from: string = 'shopping-cart';

  items: Item[] = [];
  productos: any[] = [];
  resumen_compra: any = {};
  idCar: number = 0;
  _total: number = 0;
  _administrativo: string = '';
  codeDiscount: number = 0;
  codigos_descuento: any[] = [];
  codigo_descuento: any;
  discount_general: number = 0;
  descuento_por_cliente: number = 0;
  total_discount_general: number = 0;
  total_descuento_por_cliente: number = 0;
  discount: number = 0;
  _totalStrPre: number = 0;
  impuesto: number = 0;
  user: any;
  moneda_operacion: string = '';
  idUsuario: number = 0;
  clientId: string = '';

  loading: boolean = false;
  terminosYCondicones: boolean = false;
  listRenovations: Item[] = [];
  archivos: File[] = [];
  infoSolicitudCarro: any;
  actual_support: any;
  isLoading: boolean = false;

  private static USUARIO_KEY = 'currentUser';
  @Input() set _itemList(products: Item[]) {
    this.items = products;
    this.getTotal();
  }

  constructor(
    private authenticationService: AuthenticationService,
    private codigosService: CodigosService,
    public dialog: MatDialog,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _wlService: WishlistService,
    private documentService: DocumentsService,
    private router: Router,
    private comprasEstadoSer: CompraEstadoService,
    private accionPagoSer: AccionPagoService,
    private cotizacionService: CotizacionService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('PurchaseSummaryComponent changes', changes, this.estado, this.estado_compra);
    if(this.user && this.user.idUsuario) this.obtenerResumenCompra();
    this.loadActualSupport();

  }
  ngOnInit(): void {
    this.authenticationService._user.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          console.log('Viendo user', user);
          this.user = user;
          this.moneda_operacion = user.currency;
          this.idUsuario = user.idUsuario;
          this.clientId = user.client_id;
          // this.getTotal();
          this.obtenerResumenCompra();
          // this.obtenerDescuentoAplicado();
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  obtenerResumenCompra(){
    this.comprasEstadoSer.obtenerResumenCompra(this.user.idUsuario, this.paquetes, this.estado_compra).subscribe(res=>{
       this.resumen_compra = res;
    });
  }

  getTotal(): void {
    console.log('<<<entra a total>>>');

    this.productos = [];
    if (this.items.length !== 0) {
      this.idCar = this.items[0].cons_carro_compra;
      this.items.forEach(element => {
        this.addItemToList(element);
      });
    }

    if (this.productos.length > 0) {
      this.calcularTotal();
    }
    const adminValue = parseFloat((0.0129 * this._total).toFixed(0)) + 800;
    this._administrativo = adminValue + '';
  }

  addItemToList(entry: Item): void {
    this.productos.push({
      cons_item_lista: entry.cons_item_lista,
      cons_producto: entry.cons_producto,
      periodos: entry.new_cantidad,
      precio: entry.new_total_bruto,
      cantidad: entry.new_cantidad,
      tipo_tiempo: entry.type_periodicidad_pago,
      subTotal: entry.new_total_bruto_cantidad,
      total: entry.new_total_iva,
      descuento: entry.new_total_descuentos,
      impuesto: entry.new_valor_iva,
      tiempo: entry.time_periodicidad_pago,
    });
  }

  calcularTotal(): void {
    let total = 0;
    let subTotal = 0;
    let discount = 0;
    let impuesto = 0;

    this.productos.forEach(({ total: itemTotal, subTotal: itemSubTotal, descuento, cantidad, impuesto: itemImpuesto }) => {
      total += itemTotal || 0.0;
      subTotal += itemSubTotal || 0.0;
      discount += descuento ? descuento * cantidad : 0.0;
      impuesto += itemImpuesto || 0.0;
    });

    if (this.codeDiscount > 0) {
      const subTotalOri = subTotal;
      // const discountAmount = (subTotal * this.codeDiscount) / 100;
      // subTotal -= discountAmount;
      // discount = discountAmount;
      this.total_descuento_por_cliente = (subTotal * this.descuento_por_cliente) / 100;
      this.total_discount_general = (subTotal * this.discount_general) / 100;
      discount = this.total_descuento_por_cliente + this.total_discount_general;
      impuesto = (impuesto * subTotal) / subTotalOri;
      total = subTotal + impuesto - discount;
    }

    this._totalStrPre = subTotal;
    this.discount = discount;
    this.impuesto = impuesto;
    this._total = total;

    console.log(this._totalStrPre, this.discount, this.impuesto, this._total);
  }
  obtenerCodigosDescuento(): void {
    this.codigosService.getCodigobyUser(this.idUsuario).subscribe({
      next: (res: CodigoDescuento[]) => {
        res.forEach(element => {
          element.fecha_fin_vigencia = moment.utc(element.fecha_fin_vigencia).format('DD/MM/YYYY');
        });
        console.log('codigos_descuento', res);
        this.codigos_descuento = res;
      },
      error: err => {
        console.error('Error al obtener los códigos de descuento', err);
      },
    });
  }
  obtenerDescuentoAplicado(): void {
    this.codigosService.obtenerDescuentoAplicado(this.user.idUsuario).subscribe({
      next: (res: DescuentoAplicado[]) => {
        this.codigo_descuento = res?.[0] ?? null;

        this.total_discount_general = 0;
        this.total_descuento_por_cliente = 0;
        console.log('entra a obtenerDescuentoAplicado', this.codigo_descuento);
        if (this.codigo_descuento) {
          let destinatarios_rol = JSON.parse(this.codigo_descuento?.destinatarios_rol);
          if (destinatarios_rol.length > 0) {
            this.descuento_por_cliente = this.codigo_descuento?.porcentaje ?? 0;
            this.discount_general = 0;
          }
          if (destinatarios_rol.length === 0) {
            this.discount_general = this.codigo_descuento?.porcentaje ?? 0;
            this.descuento_por_cliente = 0;
          }
        }
        this.codeDiscount = this.codigo_descuento?.porcentaje ?? 0;
        this.calcularTotal();
      },
      error: err => {
        console.error('Error al obtener el descuento aplicado', err);
      },
    });
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>): void {
    this.codigo_descuento = null;
    this.obtenerCodigosDescuento();
    this.dialog.open(templateRef, { width: '850px' });
  }
  deleteCode(): void {
    this.codigosService.borrarAplicacionDescuento(this.resumen_compra.id_aplicado).subscribe({
      next: () => {
        this._snackBar.open('Código de descuento eliminado', 'OK', { duration: 2000 });
        this.obtenerResumenCompra();
      },
      error: err => {
        console.error('Error al eliminar el código de descuento', err);
        this._snackBar.open('Error al eliminar el código de descuento', 'OK', { duration: 2000 });
      },
    });
  }
  showTerms(): void {
    this.terminosYCondicones = false;
    const enlaces = new Map<number, { id: number; name: string; link: string; checked: boolean }>();
    const arrays_productos = this.items.concat(this.listRenovations);

    arrays_productos.forEach(item => {
      if (!enlaces.has(item.cons_categoria_producto)) {
        enlaces.set(item.cons_categoria_producto, {
          id: item.cons_categoria_producto,
          name: item.des_categoria_producto,
          link: item.enlace_tyc,
          checked: false,
        });
      }
    });

    const dialogRef = this._dialog.open(DialogTerminosCondicionesComponent, {
      width: '450px',
      data: { tYc: this.terminosYCondicones, info: Array.from(enlaces.values()) },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.terminosYCondicones = result === 1;
      this.actualizarTerminos();
    });
  }
  actualizarTerminos() {
    let terms: number;
    if (!this.idCar) {
      if (this.items[0]) {
        this.idCar = this.items[0].cons_carro_compra;
      } else if (this.listRenovations[0]) {
        this.idCar = this.listRenovations[0].cons_carro_compra;
      }
    }
    if (this.terminosYCondicones === true) {
      terms = 1;
    } else {
      terms = 0;
    }
    const termsData = {
      car: this.idCar,
      terms: terms,
    };
    this._wlService
      .updateTermsToShopCar(termsData)
      .pipe(take(1))
      .subscribe(res => {
        // Pendiente manejo de respuesta?
      });
  }
  /**
   * Función auxiliar para verificar que el cliente tenga los documentos actualizados para una renovación
   * 2021-12-07, ing Fernando Vargas
   * @param {string} whoCall Indica que opción seleccionó el usuario Posibles valores: -- Pago_Electronico --Pago_transferencia
   */
  async validateDocuments(whoCall: string): Promise<void> {
    this.updateItemLista();
    this.loading = true;
    const cons_cliente = this.user.client_id;

    if (this.listRenovations.length > 0) {
      this.documentService.getDocuments(cons_cliente).subscribe({
        next: docs => {
          this.loading = false;
          const documents = docs.data.filter((x: any) => x.activo === 1);

          if (this.validateDateDocument(documents[0])) {
            this.handlePayment(whoCall);
          } else {
            this.router.navigate(['/marketplace/documents']);
          }
        },
        error: err => {
          console.error('Error fetching documents', err);
          this.loading = false;
          this.handlePayment(whoCall);
        },
      });
    } else {
      this.handlePayment(whoCall);
      this.loading = false;
    }
  }
  private handlePayment(whoCall: string): void {
    if (whoCall === 'pago_electronico') {
      this.pagoMinimo();
    } else {
      this.getPaymentMethods();
    }
  }

  actualizarInformacionDescuentosItemLista(): void {
    const informacionDescuentos: DiscountInfo[] = this.items.map((product: Item) => ({
      cons_carro_compra: product.cons_carro_compra,
      cons_item_lista: product.cons_item_lista,
      valor_unitario: product.new_total_con_recargo ?? 0,
      cantidad: product.new_cantidad ?? 0,
      descuento_preferencial: parseInt(product.new_porcentaje_rol ?? '0', 10),
      descuento_por_volumen: parseInt(product.new_procentaje_volumen ?? '0', 10),
      descuento_general: this.discount_general ?? 0,
      descuento_por_cliente: this.descuento_por_cliente ?? 0,
    }));

    this._wlService.updateInfoDiscountProducs(informacionDescuentos);
  }

  updateItemLista(){
    console.log('entra a updateItemLista');
    this._wlService.updateItemLista(this.user.idUsuario, this.resumen_compra.cons_carro_compra).subscribe(res=>{
      console.log('updateItemLista ok');
    });
  }

  /**
   * Función auxiliar para comparar la fecha del documento y saber si es o no válido a la fecha actual
   * @param {*} document datos del primer documento
   */
  validateDateDocument(document: any) {
    const valor_conversion = 1000 * 60 * 60 * 24;
    const fecha_base = new Date().getTime() - valor_conversion * 366;
    const date1 = new Date(document ? document.fecha_creacion : fecha_base).getTime();
    const date2 = new Date().getTime();
    const difference = (date2 - date1) / valor_conversion;
    if (difference > 365) {
      return false;
    }
    return true;
  }
  pagoMinimo(): void {
    if (this.resumen_compra.total <= 0) {
      this._snackBar.open('No es posible hacer una compra con en valor de ' + this._total, 'ok', { duration: 2000 });
      return;
    }

    if (!this.idCar) {
      const firstItem = this.items[0] || this.listRenovations[0];
      if (firstItem) {
        this.idCar = firstItem.cons_carro_compra;
      }
    }

    if (this._facturasList.length) {
      let items_factura: Detalle[] = [];
      const facturas = this._listFacturasSelected.length
        ? this._listFacturasSelected
        : this._facturasList.map((f: Factura) => f.cons_factura_renovacion);

      facturas.forEach((facturaId: number) => {
        const invoice = this._facturasList.find((element: Factura) => element.cons_factura_renovacion === facturaId);
        if (invoice) {
          const detalle_ = invoice.detalle.map((item: Detalle) => ({ ...item, factura: invoice.cons_factura_renovacion }));
          if (this._listFacturasSelected.length) {
            if (invoice.cons_carro_compra === this.idCar) {
              items_factura = items_factura.concat(detalle_);
            }
          } else {
            if (invoice.cons_carro_compra !== this.idCar) {
              items_factura = items_factura.concat(detalle_);
            }
          }
        }
      });

      const parametros: Parametros = { queryParams: {} };

      if (this._listFacturasSelected.length === 1) {
        parametros.queryParams.id = this._listFacturasSelected[0];
      } else {
        parametros.queryParams.aplica = true;
      }
      if (items_factura.length > 0) {
        this._wlService.createShopCarInvoice(this.idUsuario, this._listFacturasSelected.length > 0, items_factura).subscribe({
          next: () => {
            console.log('<<<PASA ROUTER>>>');
            this.router.navigate(['/marketplace/compra_actual/pasarela'], parametros);
          },
          error: err => console.error('Error creating shop car invoice', err),
        });
      } else {
        this.router.navigate(['/marketplace/compra_actual/pasarela'], parametros);
      }
    } else {
      this.iniciarProcesoPago(this.idCar, 's');
    }
  }
  iniciarProcesoPago(solicitudCompra: number, tipoCompra: string): void {
    console.log('accion Pago', PurchaseSummaryComponent.USUARIO_KEY);
    const usuarioHash = localStorage.getItem(PurchaseSummaryComponent.USUARIO_KEY);

    if (usuarioHash === null) {
      this._snackBar.open('No es posible obtener los datos del usuario', 'ok', { duration: 2000 });
      return;
    }

    const data = {
      cart: this.idCar.toString(),
      valor_envio: this.resumen_compra.valor_envio,
      estado: 'PPP',
    };
    this.loading = true;
    this.comprasEstadoSer.updateCompra(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loading = false;
        const us = JSON.parse(usuarioHash);
        const usuario: UsuarioModel = {
          id: this.user.idUsuario,
          client_id: us.client_id,
          Au: us.email,
          Ad: `${this.user?.first_name} ${this.user?.last_name}`,
        };
        this.loading = true;
        this.accionPagoSer
          .generarReferenciaMercadoPago(usuario, this._total + this.totalEnvio, solicitudCompra, this.impuesto, tipoCompra)
          .pipe(take(1))
          .subscribe({
            next: (result: DatosPagoModel) => {
              this.loading = false;
              window.location.href = result.init_point;
            },
            error: error => {
              this.loading = false;
              console.error(error)
            }
          });
      },
      error: error => {
        this.loading = false;
        console.error('Error updating compra', error);
        this._snackBar.open('Error al actualizar la compra', 'ok', { duration: 2000 });
      },
    });
  }
  getPaymentMethods(edit: boolean = true): void {
    console.log('Car ID:', this.idCar);

    const dialogRef = this.dialog.open(MediosPagoComponent, {
      width: '600px',
      data: { edit, cons_carro: this.idCar },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this._total === 0) {
          this._snackBar.open('No es posible hacer una compra con un valor de ' + this._total, 'ok', { duration: 2000 });
          return;
        }

        if (!this.idCar) {
          this.idCar = this.items[0]?.cons_carro_compra || this.listRenovations[0]?.cons_carro_compra;
        }

        const data = {
          cart: this.idCar.toString(),
          valor_envio: this.resumen_compra.valor_envio,
          estado: 'DPO',
        };

        this.comprasEstadoSer.updateCompra(data).subscribe({
          next: (res: any) => {
            this.accionPagoSer
              .cambiarAOtrosMedios(this.idCar)
              .pipe(take(1))
              .subscribe({
                next: () => {
                  this.mostrarButon = false;
                  this.estado_compra = 0;
                  this._snackBar.open('Se inició proceso de compra por otro medio', 'ok', { duration: 2000 });
                  this.reportChange.emit(0);
                },
                error: () => {
                  this._snackBar.open(
                    'No es posible procesar la solicitud de pago por otro medio de pago, intente otra vez',
                    'ok',
                    { duration: 2000 }
                  );
                },
              });
          },
          error: error => {
            console.error('Error updating compra', error);
            this._snackBar.open('Error al actualizar la compra', 'ok', { duration: 2000 });
          },
        });
      }
    });
  }
  comprar() {
    this.router.navigate(['marketplace/quick-buy']);
  }
  getCotizacion(): void {
    const cotizacion = {
      totalStrPre: this._totalStrPre,
      discount: this.discount,
      impuesto: this.impuesto,
      total: this._total,
      itemList: this.items,
    };

    this.cotizacionService.generarCotizacion(cotizacion).subscribe({
      next: res => {
        console.log('Cotización generada:', res);
        this._snackBar.open('Cotización generada exitosamente', 'ok', { duration: 2000 });
      },
      error: err => {
        console.error('Error generando cotización', err);
        this._snackBar.open('Error al generar la cotización', 'ok', { duration: 2000 });
      },
    });
  }
  cargarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input.files);
    if (input && input.files) {
      const valid_size = this.validateFileSize(Array.from(input.files));
      if(valid_size){
        this.archivos = Array.from(input.files);
      }else{
        this._snackBar.open('El peso máximo del archivo es hasta 5 MB', 'Ok', { duration: 3000 });
      }
    } else {
      console.error('No files selected or input is null');
    }
  }

  validateFileSize(files: any[]){
    const sizeLimit = 5 * 1024 * 1024;
    const archivos = files;
    let valid = true;
    archivos.forEach(element => {
      if(element.size>sizeLimit) valid = false;
    });
    return valid;
  }

  eliminarArchivo() {
    if (this.archivos.length > 0) {
      this.archivos.splice(0, 1);
    }
  }
  cancelBuy(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: '¿Estas seguro?',
        message: '¿Deseas eliminar el proceso de compra por otro medio de pago?',
        cancelText: 'No',
        confirmText: 'Si',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.comprasEstadoSer
          .cancelarCompra(this.idCar)
          .pipe(take(1))
          .subscribe({
            next: res => {
              if(this.used_from == 'shopping-cart'){
                this.mostrarButon = false;
              } else if(this.used_from == 'quick-buy'){
                this.mostrarButon = true;
              }
              this._snackBar.open('Se canceló el proceso de compra por otro medio', 'ok', { duration: 2000 });
              this.reportChange.emit(1);
            },
            error: err => {
              console.error('Error en cambiar estado', err);
              this._snackBar.open('Error al cancelar el proceso de compra', 'ok', { duration: 2000 });
            },
          });
      }
    });
  }
  updateSupport(): void {
    if (this.archivos.length === 0 || !this.archivos[0]) {
      this._snackBar.open('No hay archivos para actualizar', 'ok', { duration: 2000 });
      return;
    }

    this._snackBar.open('Cargando soporte actualizado', 'ok', { duration: 2000 });

    const formData = new FormData();
    formData.append('file', this.archivos[0]);
    formData.append('bill', this.infoSolicitudCarro.cons_factura_solicitud + '');
    formData.append('client', this.clientId + '');

    this.comprasEstadoSer
      .actualizarSoporte(formData)
      .pipe(take(1))
      .subscribe({
        next: res => {
          this._snackBar.open('Soporte actualizado', 'ok', { duration: 2000 });
          this.reportChange.emit(1);
          this.loadActualSupport();
        },
        error: err => {
          console.error('Error al actualizar el soporte', err);
          this._snackBar.open('Error al actualizar el soporte', 'ok', { duration: 2000 });
        },
      });
  }
  loadActualSupport(): void {
    if(this.idCar!=0){
      this.comprasEstadoSer
      .traerActualSoporte(this.idCar)
      .pipe(take(1))
      .subscribe({
        next: res => {
          console.log('load soportes', res);
          const data = res.data;
          if (data && data.length > 0) {
            this.actual_support = data[0].factura_url;
            this.infoSolicitudCarro = data[0];
          } else {
            this.actual_support = null;
            this.infoSolicitudCarro = null;
          }
        },
        error: err => {
          console.error('Error al cargar el soporte actual', err);
          this._snackBar.open('Error al cargar el soporte actual', 'ok', { duration: 2000 });
        },
      });
    }

  }
  selectionChange(e: MatSelectionListChange): void {
    const idCodigo = e.options[0].value;
    this.codigo_descuento = this.codigos_descuento.find(codigo => codigo.id === idCodigo);
    console.log('codigo_descuento', this.codigo_descuento);
  }
  async verify(): Promise<void> {
    try {
      const params = {
        cons_usuario: this.user.idUsuario,
        cons_codigo_descuento: this.codigo_descuento.id,
      };

      // const res = await this.codigosService.aplicarDescuento(params);
      this.codigosService.aplicarDescuento(params).subscribe(res=>{
        this.dialog.closeAll();
        this._snackBar.open('Código de descuento aplicado', 'OK', { duration: 2000 });
        this.obtenerResumenCompra();
      });
    } catch (error) {
      console.error('Error al aplicar el código de descuento', error);
      this._snackBar.open('Error al aplicar el código de descuento', 'OK', { duration: 2000 });
    }
  }
  sendSupport(): void {
    if (!this.archivos || !this.archivos[0]) {
      this._snackBar.open('No hay archivos para enviar', 'ok', { duration: 2000 });
      return;
    }

    this._snackBar.open('Cargando soporte y registrando proceso de compra, espere por favor...', 'ok', { duration: 2000 });

    const formData = new FormData();
    formData.append('file', this.archivos[0]);
    formData.append('cart', this.idCar.toString());
    // Iterar sobre las entradas de formData y registrarlas en la consola
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    this.comprasEstadoSer
      .enviarSoporte(formData)
      .pipe(take(1))
      .subscribe({
        next: res => {
          this._snackBar.open('Soporte enviado', 'ok', { duration: 2000 });
          this.reportChange.emit(1);
          this.router.navigate(['/marketplace/shopping-cart']);
        },
        error: err => {
          console.error('Error al enviar el soporte', err);
          this._snackBar.open('Error al enviar el soporte', 'ok', { duration: 2000 });
        },
      });
  }
  addFactura(value: any) {
    this._facturasList.push(value);
    this.calcularTotal();
  }
  limpiarRenovationList() {
    this.listRenovations = [];
  }
  addRen(item: any): void {
    const valorTotal = item.valor * item.periodos * item.cantidad - item.saldo_a_favor;
    item.valor_pesos = item.moneda !== 'COP' ? valorTotal * (isNaN(this.trm) ? 1 : this.trm) : valorTotal;

    if (isNaN(item.valor_pesos)) {
      item.valor_pesos = valorTotal;
    }

    this.listRenovations.push(item);
    this.calcularTotal();
  }
}
