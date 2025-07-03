import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-modal-fechas',
  templateUrl: './product-modal-fechas.component.html',
  styleUrl: './product-modal-fechas.component.css',
})
export class ProductModalFechasComponent implements OnInit {
  form!: FormGroup;
  fecha!: Date;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    public router: Router,
    public dialogRef: MatDialogRef<ProductModalFechasComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    const mayor = this.data.fechas.reduce((maxDate: Date, it: any) => {
      const newDate = new Date(it.fecha);
      return newDate > maxDate ? newDate : maxDate;
    }, new Date('01/01/1900'));

    this.data.fecha = mayor.toISOString().slice(0, 10);
    this.fecha = new Date();
    this.fecha.setDate(this.fecha.getDate() + 1);
    this.form = this.fb.group({
      fecha_vigencia: [this.fecha],
    });

    this.fecha = this.data.fecha_exacta;
  }

  cancel(): void {
    // Implementación del método cancel
  }
}
