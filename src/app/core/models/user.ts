export interface User {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
  }
  
export interface NewUser {
    correo: string;
    nombres: string;
    apellidos: string;
    identificacion: string;
    telefono: string;
}