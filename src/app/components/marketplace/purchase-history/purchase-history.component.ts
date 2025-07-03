import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';


import moment from 'moment';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ProductoCompradoComponent } from './components/producto-comprado/producto-comprado.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({


  imports: [
    ProductoCompradoComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule
  ],
  selector: 'app-historial-compras',
  templateUrl: './purchase-history.component.html',
  standalone: true,
})
export class PurchaseHistoryComponent implements OnInit {

  fechaHoy = new Date();
  currentYear = this.fechaHoy.getFullYear();
  month = this.fechaHoy.getMonth();
  day = this.fechaHoy.getDate();
  beforeYear = new Date(this.currentYear - 3, this.month, this.day);
  now = new Date();
  @ViewChild('child') ChildComponent: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  startDate = this.beforeYear;
  endDate = this.now;
  fechaInicial = moment(this.startDate).format('YYYY-MM-DD')
  fechaFinal = moment(this.endDate).format('YYYY-MM-DD')

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscarCompras()
  }

  clearDates() {
    this.range.patchValue({ start: this.beforeYear, end: new Date() });
    this.buscarCompras();
  }

  buscarCompras(e: any = null) {
    console.log('buscarCompras ------>>', e, this.range);
    this.fechaInicial = moment(this.range.controls.start.value??this.startDate).format('YYYY-MM-DD')
    this.fechaFinal = moment(this.range.controls.end.value??this.endDate).format('YYYY-MM-DD')


    console.log(this.fechaInicial);
    console.log(this.fechaFinal);


    if (this.ChildComponent) {
      this.ChildComponent.listarCompras(this.fechaInicial, this.fechaFinal);
    }
  }

  changeStartDate(e: any = null) {
    console.log('changeStartDate ------>>', e);
  }
}
