import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Toast, ToastType } from '../../interfaces/toast.interface';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.css'],
})
export class CustomToastComponent {
  backgroundColor: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Toast) {
    this.backgroundColor = this.getBackgroundColor(data.type);
  }

  getBackgroundColor(type: ToastType): string {
    switch (type) {
      case ToastType.SUCCESS:
        return '#28a745'; // Verde
      case ToastType.ERROR:
        return '#dc3545'; // Rojo
      case ToastType.WARNING:
        return '#ffc107'; // Amarillo
      default:
        return '#333'; // Gris por defecto
    }
  }
}
