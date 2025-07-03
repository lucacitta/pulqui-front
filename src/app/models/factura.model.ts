export interface Factura {
  cons_factura_renovacion: number;
  cons_carro_compra?: number;
  trm: number;
  fecha_vigencia: string;
  detalle: Detalle[];
}

export interface Detalle {
  cons_producto: number;
  cantidad: number;
  cons_periodicidad_pago: number;
  tipo_producto: string;
  cons_factura_renovacion?: number;
  valor: number;
  periodos: number;
  saldo_a_favor: number;
  moneda: string;
  valor_pesos?: number;
  factura?: number;
}
