export interface Toast {
  type: ToastType;
  message: string;
  duration?: number;
}

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}
