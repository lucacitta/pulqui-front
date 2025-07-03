import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-licenses',
  templateUrl: './product-licenses.component.html',
  styleUrl: './product-licenses.component.css',
})
export class ProductLicensesComponent implements OnInit {
  form!: FormGroup;
  fecha!: Date;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ProductLicensesComponent>) {}

  ngOnInit(): void {
    this.fecha = new Date(); // Establece la fecha de hoy
    this.fecha.setDate(this.fecha.getDate() + 1); // Agrega un día para el valor mínimo

    this.form = this.fb.group({
      // Se asegura de que el FormControl está correctamente inicializado
      fecha_vigencia: new FormControl(this.fecha, Validators.required),
    });
  }

  save(): void {
    if (this.form.valid) {
      console.log('<<Fecha seleccionada>>', this.form.value.fecha_vigencia);
      this.dialogRef.close({ value: true, fecha: this.form.value.fecha_vigencia });
    }
  }

  cancel(): void {
    this.dialogRef.close({ value: false });
  }
}
