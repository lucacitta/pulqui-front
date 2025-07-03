export interface DatosPagoModel {
  merchantId: number; //
  accountId: number; //
  description?: string; //
  referenceCode?: string;
  amount?: number;
  tax?: number;
  taxReturnBase?: number;
  currency?: string; //
  signature?: string; //
  test?: string; //
  buyerEmail?: string;
  buyerFullName?: string;
  responseUrl?: string; //
  confirmationUrl?: string; //
  extra1?: string;
  extra2?: string;
  lng?: string;
  init_point: string;
}

export interface UsuarioModel {
  id: number;
  client_id?: number;
  Eea?: string;
  Paa?: string;
  Au: string; // correo
  Ad: string; // nombre completo.
  ofa?: string;
  wea?: string;
}

export interface CompraModel {
  referenceCode: string;
  amount: number;
  extra1: string;
  currency: string;
}

export interface FacturasModel {
  codigoFactura: string;
  idFactura: number;
  valor: number;
  valorNeto: number;
  nombreProducto: string;
  cantidadProducto: number;
  fecha: string;
  subtotal: number;
  iva: number;
  descuento: number;
  solicitudCompra: number;
  concepto: string;
  renta: string;
  enlace_archivo: string;
}

export interface BotnFacturaModel {
  id: number;
  valor: number;
  solicitudCompra: number;
}
export interface ArchivosModel {
  nombreArchivo: string;
  file: File;
  email: string;
}
export interface UrlModel {
  url_imagen?: string;
  url?: string;
}
