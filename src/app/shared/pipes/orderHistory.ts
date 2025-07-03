import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderMonths',
  standalone: true
})
export class OrderMonths implements PipeTransform {
  transform(value: any, args?: any): any {

    if (!value || typeof value !== 'object') {
      return [];
    }

    // Convertir el objeto en un array de pares clave-valor sin ordenar
    return Object.entries(value).map(([key, val]) => ({ key, value: val })).sort((a, b) => parseInt(b.key) - parseInt(a.key));


  }

}
