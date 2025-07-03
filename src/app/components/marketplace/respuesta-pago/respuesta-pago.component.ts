import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PulquiAuthService } from '../../../core/services/auth/pulqui-auth.service';
import { CompraEstadoService } from '../../../shared/services/compra-estado/compra-estado.service';

import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { take } from 'rxjs';
import { RespuestaPagoModel } from '../../../models/respuesta-pago.model';
import { OtrosMediosPagosService } from '../../../shared/services/otros-medios-pagos/services/otros-medios-pagos.service';

@Component({
  selector: 'app-respuesta-pago',
  templateUrl: './respuesta-pago.component.html',
  styleUrl: './respuesta-pago.component.css',
})
export class RespuestaPagoComponent implements OnInit {
  datosRespuesta!: RespuestaPagoModel;
  msm: string = '';
  estadoPago: string = '';
  fechaActualizacion = new Date('2000-12-31'); // Fecha muy antigua en pos del manejo del componente
  showMsg = false;
  detalle: string = '';
  carro: number = 0;
  client: number = 0;
  correoCliente: string = '';
  idUserCurrent: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _compra: CompraEstadoService,
    private _OMPService: OtrosMediosPagosService,
    private pulquiAuthService: PulquiAuthService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        this.inicializarDatos(params);
        this.setClientFromAuthService();

        if (this.isTransactionApproved(params)) {
          this.handleApprovedTransaction(params);
        } else {
          this._snackBar.open('No fue posible realizar la transaccion', 'ok', { duration: 2000 });
        }
      },
      error: err => {
        console.error('Error al obtener los parámetros de la ruta:', err);
        this._snackBar.open('Ocurrió un error al procesar la transacción', 'ok', { duration: 2000 });
      },
    });
  }

  setClientFromAuthService(): void {
    this.authenticationService._user.subscribe({
      next: user => {
        if (user && user.idUsuario) {
          this.client = user.client_id;
          this.idUserCurrent = user.idUsuario;
        }
      },
      error: err => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  inicializarDatos(params: Params) {
    const numberFormat = Intl.NumberFormat('en-US');
    const externalReference = params['external_reference'] ? JSON.parse(params['external_reference']) : null;

    this.estadoPago = this.getTransactionState(params);
    this.msm = this.getTransactionMessage(params);

    const referenceCode = externalReference ? externalReference.referenceCode : params['referenceCode'];
    const payment_id = params['payment_id'];
    const amount = externalReference ? numberFormat.format(externalReference.amount) : '';
    const lapTransactionState = this.msm;
    const message = params['collection_status'] || params['message'];
    const TX_VALUE = externalReference ? 0.0 : params['TX_VALUE'];
    const currency = externalReference ? 'ARS' : params['currency'];
    const processingDate = new Date(params['processingDate'] || Date.now());

    this.datosRespuesta = {
      referenceCode,
      lapTransactionState,
      message,
      TX_VALUE,
      currency,
      processingDateString: processingDate.toLocaleDateString('en-US').toString(),
      amount,
      payment_id,
    };

    console.log('mas opciones: ', JSON.stringify(this.datosRespuesta));
  }

  getTransactionState(params: Params): string {
    const state = params['status'] || params['lapTransactionState'];
    switch (state) {
      case 'approved':
      case 'APPROVED':
        return 'TA';
      case 'DECLINED':
      case 'rejected':
        return 'TR';
      case 'ERROR':
        return 'TER';
      case 'EXPIRED':
        return 'TEX';
      case 'in_pending':
      case 'PENDING':
        return 'TP';
      default:
        return 'TER';
    }
  }

  getTransactionMessage(params: Params): string {
    const state = params['status'] || params['lapTransactionState'];
    switch (state) {
      case 'approved':
      case 'APPROVED':
        return 'Transacción aprobada';
      case 'DECLINED':
      case 'rejected':
        return 'Transacción rechazada';
      case 'ERROR':
        return 'Transacción con error';
      case 'EXPIRED':
        return 'Transacción expirada';
      case 'in_pending':
      case 'PENDING':
        return 'Transacción pendiente';
      default:
        return 'Transacción con error';
    }
  }

  isTransactionApproved(params: Params): boolean {
    return params['transactionState'] === '4' || params['status'] === 'approved';
  }

  handleApprovedTransaction(params: Params): void {
    const { external_reference, extra1, extra3, amount, tax } = params;
    const externalRef = external_reference ? JSON.parse(external_reference) : null;

    this.carro = externalRef ? +externalRef['extra1'] : +extra1;
    this.client = externalRef ? +externalRef['extra3'].split('_')[0] : +extra3.split('_')[0];

    const body = this.createRequestBody(params, amount, tax);
    this.sendNotificationIfApproved(body);
    this.updatePaymentStatus(body);

    this._snackBar.open('Transaccion exitosa, consultando documentación asociada, espere por favor', 'ok', { duration: 2000 });
  }

  createRequestBody(params: Params, amount: string, tax: string): any {
    return {
      request: this.carro,
      state: this.estadoPago,
      menssage: this.msm,
      method: 'MercadoPago',
      referencia: this.datosRespuesta.referenceCode,
      valor: amount ? +amount : 0,
      impuesto: tax ? +tax : 0,
      idUserCurrent: this.idUserCurrent,
      payment_id: this.datosRespuesta.payment_id,
      datosRespuesta: this.datosRespuesta,
    };
  }

  sendNotificationIfApproved(body: any): void {
    if (body.menssage === 'Transacción aprobada') {
      const titulo = 'Se ha realizado una compra';
      const mensaje = `Referencia de pago: ${body.referencia}`;

      this._compra.obtenerUsuarioCliente(this.client).subscribe((res: any) => {
        this.correoCliente = res[0].correo;
        this.pulquiAuthService.sendnotification(this.correoCliente, titulo, mensaje).subscribe();
      });
    } else {
      console.log('Transaccion rechazada');
    }
  }

  updatePaymentStatus(body: any): void {
    this._OMPService.actualizarestadoPago(body).pipe(take(1)).subscribe();
  }

  onSeguirComprando() {
    this.router.navigate(['/marketplace/stores']);
  }

  onVerHistorial() {
    this.router.navigate(['/history']);
  }

  updContract(): void {
    this._compra
      .updateContract(this.client, this.carro)
      .pipe(take(1))
      .subscribe(
        res => {
          this.router.navigate(['/marketplace/home']);
        },
        err => {
          this.router.navigate(['/marketplace/home']);
        }
      );
  }
}
