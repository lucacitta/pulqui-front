export interface ProfileModel {
    cons_persona: number;
    nombres: string;
    apellidos: string;
    identificacion: any;
    telefono: string;
    correo: string;
    enlace_imagen?: string;
    rol?: string;
    es_empresa?: boolean;
    social?: boolean;
    token?: string;
    client_id?: number;
    nombre_empresa?: string;
  }

  export interface CompanyInformation {
    cons_cliente: number;
    nombre_empresa: string;
    nit: string;
    correspondencia: string;
    telefono_empresa: string;
    representante: string;
    correo?:string
    url_logo?: string ;
    cuentas?:any;
  }
  export interface Address {
    direccion_envio: string;
    direccion_complementaria: string;
    provincia: string;
    nombres: string;
  }