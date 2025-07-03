import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompraEstadoService } from '../../../../../shared/services/compra-estado/compra-estado.service';
import { UdcService } from '../../../../udc/services/udc.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-direccion-facturacion',
  templateUrl: './direccion-facturacion.component.html',
  styleUrl: './direccion-facturacion.component.css',
})
export class DireccionFacturacionComponent implements OnInit {
  @Output() change = new EventEmitter<void>();
  @Output() cambioDos = new EventEmitter<void>();
  @Output() btnSiguiente = new EventEmitter<void>();
  @Output() btnAtras = new EventEmitter<void>();
  @Output() loaded = new EventEmitter<void>();
  @Output() load = new EventEmitter<void>();
  @Input() datosDirecciones: any;
  @Input() provincias: any[] = [];

  direccionFacturacion!: FormGroup;
  direccionesFacturacion: any[] = [];
  mostrarFormulario: boolean = false;
  checked: boolean = true;
  tipo_documentos: any;
  localidades: any[] = [];
  opcionDireccionEnvio: boolean = false;
  opcion: boolean = false;
  currentDireccion: any = null;
  selectIndex: number = 0;
  emiteBoton: string = '';
  selectDireccionEnvio: boolean = false;
  constructor(private _serviceCompra: CompraEstadoService, private _tipoDucumento: UdcService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.builderForm();
    this.obtenerDireccionFacturacion();
    this.cargarTipoDocumentos();
  }

  obtenerDireccionFacturacion(): void {
    this._serviceCompra.obtenerDireccionFacturacionByCodigo().subscribe({
      next: (resp: any[]) => {
        this.direccionesFacturacion = resp;
        console.log('que llega en facturacion', this.direccionesFacturacion);
      },
      error: (error: any) => {
        console.error('Error al obtener direcciones de facturación:', error);
      },
    });
  }
  cargarTipoDocumentos(): void {
    this.obtenerListado('00C', 'TD');
  }

  obtenerListado(cons_codigo_producto: string, cons_codigo_definido_usuario: string): void {
    const obj = {
      cons_codigo_producto,
      cons_codigo_definido_usuario,
    };

    this._tipoDucumento
      .obtenerDetalleUDC(obj)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.tipo_documentos = res;
          console.log(this.tipo_documentos);
        },
        error: (err: any) => {
          console.error('Error al obtener listado:', err);
        },
      });
  }
  chechkDireccionEnvio(e: boolean): void {
    this.opcion = false;
    this.currentDireccion = e ? null : this.currentDireccion;
  }
  checkDirecciones(e: any) {
    this.currentDireccion = e;
  }
  agregarOtroDomicilio(opcion: boolean): void {
    this.opcion = opcion;
    this.mostrarFormulario = opcion;
    this.cambioDos.emit();
    this.opcionDireccionEnvio = false;
  }
  obtenerLocalidades(provincia: number): void {
    this._serviceCompra.obtenerLocalidades(provincia).subscribe({
      next: (res: any[]) => {
        this.localidades = res;
        console.log('Localidades:', this.localidades);
      },
      error: (error: any) => {
        console.error('Error al obtener localidades:', error);
      },
    });
  }
  previous() {
    this.btnAtras.emit();
  }
  guardarEnvioFacturacion(e: any): void {
    console.log(this.direccionFacturacion.valid, this.opcionDireccionEnvio);

    if (this.direccionFacturacion.valid || !this.opcionDireccionEnvio) {
      console.log(this.mostrarFormulario);

      if (this.direccionFacturacion.valid) {
        const data = this.direccionFacturacion.value;
        this.load.emit()
        this._serviceCompra.direccionEnvioFacturacion(data).subscribe({
          next: (res: any) => {
            console.log(res);
            this.loaded.emit()
            this.currentDireccion = res.cons_direccion_factura;
            this.mostrarFormulario = false;
            this.builderForm();
            this.opcion = false;
            this.obtenerDireccionFacturacion();
            this.next();
          },
          error: (error: any) => {
            console.error('Error al guardar dirección de envío y facturación:', error);
          },
        });
      } else {
        this.next();
      }
    } else {
      this.mostrarFormulario = false;
      this.next();
    }
  }
  builderForm(): void {
    this.direccionFacturacion = this.fb.group({
      cons_persona: [null],
      direccion_envio: ['', Validators.required],
      direccion_complementario: [''],
      nombre: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      cons_localidad: ['', Validators.required],
      telefono_fijo: ['', Validators.required],
      telefono_movil: ['', Validators.required],
    });
  }
  next(): void {
    console.log('next');
    this.btnSiguiente.emit({ ...this.datosDirecciones, cons_direccion_facturacion: this.currentDireccion });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectIndex);
    if (this.selectIndex == 0) {
      let that = this;
      setTimeout(function () {
        that.loaded.emit();
      }, 2000);
    }
  }
}
