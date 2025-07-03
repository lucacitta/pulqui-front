import { Component, Inject, OnInit } from '@angular/core';
import { Terminos } from '../../../../../models/terminos-condiciones.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-terminos-condiciones',
  templateUrl: './dialog-terminos-condiciones.component.html',
  styleUrl: './dialog-terminos-condiciones.component.css',
})
export class DialogTerminosCondicionesComponent implements OnInit {
  check: boolean = false;
  terminos: Terminos[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogTerminosCondicionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tYc: boolean; info: Terminos[] }
  ) {}

  ngOnInit(): void {
    this.check = this.data.tYc;
    this.terminos = this.data.info;
  }

  aceptarTyC(): void {
    this.dialogRef.close(1);
  }

  onNoClick(): void {
    this.dialogRef.close(-1);
  }

  checkGeneral(): boolean {
    return !this.terminos.every((item: Terminos) => item.checked);
  }
}
