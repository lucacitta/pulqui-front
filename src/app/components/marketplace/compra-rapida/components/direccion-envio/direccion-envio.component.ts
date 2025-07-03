import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompraEstadoService } from '../../../../../shared/services/compra-estado/compra-estado.service';
import { TransportistaService } from '../../../transportista/services/transportista.service';

@Component({
  selector: 'app-direccion-envio',
  templateUrl: './direccion-envio.component.html',
  styleUrls: ['./direccion-envio.component.css'],
})
export class DireccionEnvioComponent implements OnInit {
  @Input() selectIndex: number | null = null;
  @Input() provincias: any[] = [];

  @Output() readonly btnSiguiente = new EventEmitter<{ cons_direccion: number; cons_tranportista: any }>();
  @Output() readonly load = new EventEmitter<void>();
  @Output() readonly loaded = new EventEmitter<void>();
  @Output() readonly transportePreferenteEmit = new EventEmitter<boolean>();

  direccionEnvio!: FormGroup;
  addByDefault: any[] = [];
  localidades: any[] = [];
  mostrarFormulario = false;
  mostrarFormularioTransportista = false;
  selectDireccionEnvio: number | null = null;
  loadingDirecciones = true;

  constructor(
    private fb: FormBuilder,
    private _serviceCompra: CompraEstadoService,
    private _serviceTransportista: TransportistaService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadDirecciones();
  }

  private buildForm(): void {
    this.direccionEnvio = this.fb.group({
      direccion_envio: ['', Validators.required],
      direccion_complementario: [''],
      cons_provincia: ['', Validators.required],
      cons_localidad: ['', Validators.required],
      codigo_postal: ['', Validators.required],
      telefono_fijo: ['', Validators.required],
      telefono_movil: ['', Validators.required],
    });
  }

  private loadDirecciones(): void {
    this.loadingDirecciones = true;
    this._serviceCompra.obtenerDireccionByCodigo().subscribe({
      next: resp => {
        this.addByDefault = resp;
        this.loadingDirecciones = false;
        this.loaded.emit();

        if (this.addByDefault.length > 0) {
          const primeraDireccion = this.addByDefault[0];

          this.selectDireccionEnvio = primeraDireccion.cons_direccion;

          this.direccionEnvio.patchValue({
            direccion_envio: primeraDireccion.direccion_envio,
            direccion_complementario: primeraDireccion.direccion_complementario || '',
            cons_provincia: primeraDireccion.cons_provincia,
            cons_localidad: primeraDireccion.cons_localidad,
            codigo_postal: primeraDireccion.codigo_postal,
            telefono_fijo: primeraDireccion.telefono_fijo,
            telefono_movil: primeraDireccion.telefono_movil,
          });

          if (primeraDireccion.cons_provincia) {
            this.obtenerLocalidades(primeraDireccion.cons_provincia);
          }
        }
      },
      error: err => {
        console.error('Error al obtener direcciones:', err);
        this.loadingDirecciones = false;
      },
    });
  }

  listadoTranportista(checked: boolean): void {
    this.mostrarFormularioTransportista = checked;
    this.transportePreferenteEmit.emit(checked);
  }

  checkDirecciones(id: number): void {
    this.selectDireccionEnvio = id;
  }

  agregarOtroDomicilio(opcion: boolean): void {
    this.mostrarFormulario = opcion;
    if (opcion) {
      this.direccionEnvio.reset();
      this.selectDireccionEnvio = null;
    }
  }

  obtenerLocalidades(provincia: number): void {
    this._serviceCompra.obtenerLocalidades(provincia).subscribe({
      next: locs => (this.localidades = locs),
      error: err => console.error('Error al obtener localidades:', err),
    });
  }

  guardarEnvio(): void {
    this.btnSiguiente.emit({
      cons_direccion: this.selectDireccionEnvio!,
      cons_tranportista: null,
    });
  }
}
