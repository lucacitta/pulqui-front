import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccionPagoService } from '../../services/accion-pago.service';
import { take, tap } from 'rxjs/operators';
import { Bank } from '../../../../../models/bank.model';

interface DialogData {
  edit: boolean;
  cons_carro: any;
}

@Component({
  selector: 'app-medios-pago',
  templateUrl: './medios-pago.component.html',
  styleUrls: ['./medios-pago.component.css'],
})
export class MediosPagoComponent implements OnInit {
  edit: boolean;
  cons_carro: any;
  banks: Bank[] = [];
  error = false;

  constructor(
    public dialogRef: MatDialogRef<MediosPagoComponent>,
    private accionPagoSer: AccionPagoService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.edit = data.edit;
    this.cons_carro = data.cons_carro;
  }

  ngOnInit(): void {
    this.loadSources();
  }

  loadSources(): void {
    this.accionPagoSer
      .traerMetodosPago(this.cons_carro)
      .pipe(take(1))
      .subscribe({
        next: res => {
          if (res.code === 200) {
            this.banks = res.data;
          } else {
            this.error = true;
          }
        },
        error: () => {
          this.error = true;
        },
      });
  }

  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.closeDialog(false);
  }

  save(): void {
    this.closeDialog(true);
  }
}
