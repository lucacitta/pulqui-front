import { Component, effect, Input, OnInit, signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
// import { DetalleCompraComponent } from '../detalle-compra/detalle-compra.component';
import { MatDialog } from '@angular/material/dialog';
// import * as moment from 'moment-timezone';
import { Router } from '@angular/router';
import { PurchaseHistoryService } from '../../purcharse-history.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import moment from 'moment';
import { OrderMonths } from '../../../../../shared/pipes/orderHistory';
import { timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-producto-comprado',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    OrderMonths
  ],
  templateUrl: './producto-comprado.component.html',
  styleUrl: './producto-comprado.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductoCompradoComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private _historyPurchaseService: PurchaseHistoryService,
    private _authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.showPurchases = false;

    this._authenticationService.user$.subscribe(user => {

      this.user = user;

      this.moneda_operacion = ((this.user && this.user != null) ? this.user : { currency: "ARS" }).currency;

      if(this.user) this.listarCompras(this.startDate, this.endDate);
    });
  }

  showPurchases = false;
  loading = false;
  @Input() startDate: any;
  @Input() endDate: any;

  agrupadas = signal<any>({});
  compras: any;

  user: any = {};
  moneda_operacion: string = "";

  ngOnInit() { }

  listarCompras(startDate: Date, endDate: Date) {

    this.loading = true;
    this._historyPurchaseService.getHistorial(startDate, endDate).subscribe(
      (response: any) => {

        if (response.length === 0) {
          this.loading = false;
          return this.showPurchases = false;
        }

        let dataFinal: any = {}
        const compras = response;

        compras.map(function (it: any, i: any) {
          compras[i].annio = moment(it.transaction_date).format("YYYY");
          compras[i].mes = moment(it.transaction_date).format("MM");
          compras[i].fechaLabel = moment(it.transaction_date).format("YY-MM-DD");

          // compras[i].productos = JSON.parse(it.productos);
        })

        this.compras = compras;
        const groupByYear = this.groupBy("annio");
        const resultado = groupByYear(this.compras)

        for (const [key, value] of Object.entries(resultado)) {
          let groupByMonth = this.groupBy("mes");
          dataFinal[key] = groupByMonth(value);
        }

        this.agrupadas.set(dataFinal);
        this.loading = false;

        return this.showPurchases = true;
      }
    )
  }

  ngAfterViewInit() {
    timer(1).subscribe(() => {
      this.listarCompras(this.startDate, this.endDate);
    })
  }

  groupBy(key: any) {
    return function group(array: any) {
      return array.reduce((acc: any, obj: any) => {
        const property = obj[key];
        acc[property] = acc[property] || [];
        acc[property].push(obj);
        return acc;
      }, {});
    };
  }

  checkNameMonth(month: any) {
    let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return months[month - 1];
  }

  showDetails(data: any) {
    console.log('saved item', data);
    const id_compra = data.cons_compra;
    // localStorage.setItem("currentDevolucion",JSON.stringify(data));
    // this.router.navigate([`/history/details/`])
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/history/details/${id_compra}`])
      // this.router.createUrlTree([`/producto-devolucion/${1}`])
    );
    window.open(url, '_self');
    // const dialogRef = this.dialog.open(DevolucionCompraComponent, {
    //   width: '90%',
    //   maxWidth: '90%',
    //   data: data,
    // });

    // dialogRef.afterClosed().subscribe(() => {
    //   // this.cargarListaUDC();
    // });
  }
  // crearDevolucion(data: any) {
  //   data.type = 1;
  //   const dialogRef = this.dialog.open(DetalleCompraComponent, {
  //     width: '560px',
  //     maxWidth: '90%',
  //     data: data,
  //   });

  //   dialogRef.afterClosed().subscribe(() => {
  //     // this.cargarListaUDC();
  //   });
  // }

}
