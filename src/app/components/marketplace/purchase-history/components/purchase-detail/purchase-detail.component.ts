import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../../core/services/auth/authentication.service';
import { PurchaseReturnModalComponent } from '../detalle-compra/purchase-return-modal.component';
import { PurchaseHistoryService } from '../../purcharse-history.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class PurchaseDetailComponent implements OnInit, OnDestroy {
  item$ = signal<any>(null);
  moneda_operacion: string = '';
  id_compra = 0;

  constructor(
    public dialog: MatDialog,
     private _authenticationService: AuthenticationService, 
     private _purchaseHistoryService: PurchaseHistoryService,
     public _rutaActiva: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.id_compra = this._rutaActiva.snapshot.params['id'];
    console.log('id compra', this.id_compra);
    this._authenticationService.user$.subscribe(user => {
      if (user){
        this.getItem();
        this.moneda_operacion = (user ? user : { currency: 'ARS' }).currency;
      } 
    });

    // this.updateCurrent();
  }

  ngOnDestroy() {
    localStorage.removeItem('currentDevolucion');
  }

  setDevolucion(item: any) {
    item.numero_orden = this.item$().numero_orden;
    item.type = 1;
    const dialogRef = this.dialog.open(PurchaseReturnModalComponent, {
      width: '50vw',
      maxWidth: '100%',
      disableClose: true,
      data: item,
      panelClass: ['modal-w-full', 'custom-dialog-responsive-modal-simulators'],
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res?.refresh) this.getItem();
    });
  }

  updateCurrent() {
    const currentDevolucion = localStorage.getItem('currentDevolucion');
    console.log('item on local storage', currentDevolucion);
    if (currentDevolucion) this.item$.set(JSON.parse(currentDevolucion));
  }

  getItem(){
    this._purchaseHistoryService.getHistorialByCompra(this.id_compra).subscribe(res=>{
      console.log('res productos', res);
      let item = res[0];
      if(item) item.productos = JSON.parse(item.productos);
      this.item$.set(item)
    })
  }
}
