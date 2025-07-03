import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CompraEstadoService } from '../../../../../shared/services/compra-estado/compra-estado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paquete } from '../../../../../models/paquete.model';

@Component({
  selector: 'app-metodo-envio',
  templateUrl: './metodo-envio.component.html',
  styleUrl: './metodo-envio.component.css',
})
export class MetodoEnvioComponent implements OnInit, OnChanges {
  @Input() datosDirecciones: any;
  @Input() transportePreferente: any;
  @Input() selectIndex: number = 0;
  @Input() showBackButton: boolean = true;

  @Output() btnSiguiente = new EventEmitter<void>();
  @Output() btnCompras = new EventEmitter<Paquete[]>();
  @Output() btnAtras = new EventEmitter<void>();
  @Output() load = new EventEmitter<void>();
  @Output() loaded = new EventEmitter<void>();

  paquetes: Paquete[] = [];
  finalizar: boolean = false;
  paquetesAEnviar: any[] = [];
  contMensaje: number = 0;
  envioGratis = { id: 0, valorEnvio: 0 };

  constructor(
    private _serviceCompra: CompraEstadoService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.selectIndex === 2 && this.datosDirecciones) {
      this.cargarTransportistas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectIndex === 2 && changes['datosDirecciones']) {
      const curr = changes['datosDirecciones'].currentValue;
      const prev = changes['datosDirecciones'].previousValue;

      if (JSON.stringify(curr) !== JSON.stringify(prev)) {
        this.cargarTransportistas();
      }
    }
  }

  private cargarTransportistas(): void {
    this.load.emit();

    this._serviceCompra.getCompraTransportistas().subscribe({
      next: (res) => {
        this.paquetes = res.paquetes;
        this.loaded.emit();
      },
      error: (err) => {
        console.error('Error al obtener transportistas:', err);
        this.loaded.emit();
      },
    });
  }

  checkMetodoEnvio(e: any, i: number): void {
    let finalizar = true;
    let totalEnvio = 0;

    this.paquetes[i].selected = true;
    this.paquetes[i].valorEnvio = e.valorEnvio;
    this.paquetesAEnviar[i] = {
      transportista: e,
      productos: this.paquetes[i].productos,
    };

    this.paquetes.forEach((jt) => {
      if (jt.selected) {
        totalEnvio += jt.valorEnvio!;
      } else {
        finalizar = false;
      }
    });

    if (finalizar) {
      this._serviceCompra
        .setCompraTransportistas({ paquetes: this.paquetesAEnviar })
        .subscribe({
          next: (res) => {
            console.log('Transportistas guardados:', res);
          },
          error: (err) => {
            console.error('Error al guardar transportistas:', err);
          },
        });
      this.btnSiguiente.emit();
    } else if (this.contMensaje === 0) {
      this.contMensaje++;
      this._snackBar.open(
        `Debe seleccionar todas las transportistas de su envío`,
        'ok',
        {
          duration: 3000,
        }
      );
    }

    this.btnCompras.emit(this.paquetes);
  }

  previous(): void {
    this.btnAtras.emit();
  }

  guardar(): void {
    console.log(this.paquetesAEnviar);
    this._serviceCompra
      .setCompraTransportistas({ paquetes: this.paquetesAEnviar })
      .subscribe({
        next: (res) => {
          console.log('Guardado final:', res);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
        },
      });
    this.btnSiguiente.emit();
  }
}
