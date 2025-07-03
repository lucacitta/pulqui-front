export interface ShopCart {
  items: ShoppingCartItem[];
  fecha_actualizacion: string;
  estado: number;
}
export interface ShoppingCartItem {
  renovacion: number | null;
  idtbl_factura_renovacion: number | null;
  // Otros campos relevantes
}
