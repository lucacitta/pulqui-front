import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../category.service';

const ALTURA_MAXIMA_DIV = 500;
const INICIO_SCROLL_SUPERIOR = 0;

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  @Input() open = true;
  @Input() title = '';
  @Input() isStore = false;
  @Input() over = false;
  @Input() idStore!: number;
  @Input() idCategory!: number;
  @Input() idSubCategory!: number;

  @Output() update = new EventEmitter<boolean>();
  @Output() closedNav = new EventEmitter<void>();
  @Output() filterUpdate = new EventEmitter<any>();
  @Output() clearAll = new EventEmitter<void>();

  isLoadingFilter = true;
  colors: any[] = [];
  marca: any[] = [];
  caracteristicas: any[] = [];
  options = { floor: 0, ceil: 0 };
  minValue = 0;
  maxValue = 0;

  filterData: any = {
    CF: [] as any[],
    CL: [] as any[],
    MR: [] as any[],
    precio: { desde: 0, hasta: 0 },
  };

  private initialFilterData!: any;

  constructor(private _categoryServices: CategoryService) {}

  async ngOnInit() {
    this.isLoadingFilter = true;
    const filtros: any = await firstValueFrom(
      this._categoryServices.getFilters({
        idTienda: this.idStore,
        idCategoria: this.idCategory,
        idSubCategoria: this.idSubCategory,
      })
    );

    // Colores
    JSON.parse(filtros.colores).forEach((c: any) => {
      this.colors.push({
        custom: c,
        name: c.descripcion_1,
        color: c.descripcion_2,
        val: false,
      });
    });

    // Marcas
    JSON.parse(filtros.marcas).forEach((m: any) => {
      this.marca.push({
        custom: m,
        name: m.descripcion_1,
        val: false,
      });
    });

    // Precio
    const precios = JSON.parse(filtros.precios);
    this.options = { floor: precios.desde, ceil: precios.hasta };
    this.minValue = precios.desde;
    this.maxValue = precios.hasta;
    this.filterData.precio = { desde: this.minValue, hasta: this.maxValue };

    // Características
    JSON.parse(filtros.carfisicas).forEach((c: any) => {
      this.caracteristicas.push({
        custom: c,
        name: c.descripcion_1,
        medidas: c.valores.map((v: any) => ({ name: v, val: false })),
        val: false,
      });
    });

    this.initialFilterData = JSON.parse(JSON.stringify(this.filterData));
    this.isLoadingFilter = false;
  }

  ngOnDestroy(): void {}

  emitClose() {
    this.closedNav.emit();
  }

  changefilter(type: string, item?: any, subitem?: any) {
    switch (type) {
      case 'CL':
        item!.val
          ? this.filterData.CL.push(item!.custom.cons_codigo)
          : (this.filterData.CL = this.filterData.CL.filter(
              (c: any) => c !== item!.custom.cons_codigo
            ));
        break;
      case 'MR':
        item!.val
          ? this.filterData.MR.push(item!.custom.cons_codigo)
          : (this.filterData.MR = this.filterData.MR.filter(
              (m: any) => m !== item!.custom.cons_codigo
            ));
        break;
      case 'precio':
        this.filterData.precio.desde = this.minValue;
        this.filterData.precio.hasta = this.maxValue;
        break;
      case 'CF':
        const obj = { [item!.custom.cons_codigo]: subitem.name };
        subitem.val
          ? this.filterData.CF.push(obj)
          : (this.filterData.CF = this.filterData.CF.filter(
              (cf: any) => JSON.stringify(cf) !== JSON.stringify(obj)
            ));
        break;
    }
    this._categoryServices.emitFilterChangeEvent(this.filterData);
    this.filterUpdate.emit(this.filterData);
  }

  toggleColor(c: any) {
    c.val = !c.val;
    this.changefilter('CL', c);
  }

  onClearAll() {
    this.colors.forEach((c) => (c.val = false));
    this.marca.forEach((m) => (m.val = false));
    this.caracteristicas.forEach((c) => {
      c.val = false;
      c.medidas.forEach((m: any) => (m.val = false));
    });
    this.filterData = JSON.parse(JSON.stringify(this.initialFilterData));
    this.minValue = this.options.floor;
    this.maxValue = this.options.ceil;
    this._categoryServices.emitFilterChangeEvent(this.filterData);
    this.filterUpdate.emit(this.filterData);
    this.clearAll.emit();
  }

  afterClosed(indice: number): void {
    const divFilter = document.getElementById('divFilter');
    const sec = document.getElementById(`caracteristicas-seccion${indice}`);
    if (divFilter && sec && sec.clientHeight > ALTURA_MAXIMA_DIV) {
      divFilter.scrollTop = INICIO_SCROLL_SUPERIOR;
    }
  }
}
