import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-product-modal-continue',
  templateUrl: './product-modal-continue.component.html',
  styleUrl: './product-modal-continue.component.css',
})
export class ProductModalContinueComponent implements OnInit {
  form!: FormGroup;
  fecha!: Date;
  itemsCount: number = 0;
  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    public router: Router,
    public dialogRef: MatDialogRef<ProductModalContinueComponent>,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.fecha = new Date();
    this.fecha.setDate(this.fecha.getDate() + 1);
    this.form = this.fb.group({
      fecha_vigencia: [this.fecha, Validators.required],
    });
    console.log('tenemos que ver carrito');
    // this.shoppingCartService.itemsShop$.subscribe(count => {
    //   this.itemsCount = count;
    //   console.log('en el carrito:', this.shoppingCartService.itemsCart$()); // Ver la cantidad de elementos en el carrito
    //   console.log('Cantidad de elementos en el carrito:', this.itemsCount); // Ver la cantidad de elementos en el carrito
    // });
  }

  async irCarrito(): Promise<void> {
    console.log(this.dialogRef);
    this.dialogRef.close();
    await this.router.navigateByUrl('/marketplace/shopping-cart');
  }

  save(): void {
    console.log('<<entra>>', this.form.value.fecha_vigencia);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
