export interface Item {
  cons_carro_compra: number;
  cons_item_lista: number;
  cons_producto: number;
  new_cantidad: number;
  new_total_bruto: number;
  new_total_bruto_cantidad: number;
  new_total_iva: number;
  new_total_descuentos: number;
  new_valor_iva: number;
  type_periodicidad_pago: string;
  time_periodicidad_pago: string;
  cons_categoria_producto: number;
  des_categoria_producto: string;
  enlace_tyc: string;
  new_total_con_recargo?: number;
  new_porcentaje_rol?: string;
  new_procentaje_volumen?: string;
}
