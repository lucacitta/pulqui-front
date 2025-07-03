import { Injectable } from '@angular/core';
import { CompraEstadoService } from '../compra-estado/compra-estado.service';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrmService {
  trm: number = 0;

  constructor(private carritoService: CompraEstadoService) {}

  public async getTRM(): Promise<number> {
    try {
      const res = await firstValueFrom(this.carritoService.checkTRM().pipe(take(1)));
      // 2020-09-30 Modificacion del trm, se adiciona 1.5% + 20 pesos
      // this.trm = parseFloat(res.data.value) * 1.015 + 20;
      this.trm = parseFloat(res.value);
    } catch (err) {
      console.error('Error consultando TRM', err);
      this.trm = 3900; // Valor por defecto
    }
    return this.trm;
  }
}
