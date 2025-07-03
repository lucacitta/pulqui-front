export interface RespuestaPagoModel {
  referenceCode?: string;
  lapTransactionState?: string;
  message?: string;
  TX_VALUE?: number;
  currency?: string;
  processingDateString?: string;
  fullName?: string;
  amount?: string;
  payment_id?: string;
}
