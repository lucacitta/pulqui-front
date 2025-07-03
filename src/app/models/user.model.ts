export interface Login {
    username: string
}

export interface Register {
    username: string;
    password: string;
    password_confirmation: string;
}

export interface Profile {
    name: string;
    surname: string;
    image: string;
    username: string;
}

export interface GoogleCredentials {
    client_id: string;
    scope: string;
    cookiepolicy: string;
}

export interface AnswerEmailDNSGoogle {
    name: string;
    type: number;
    TTL: number;
    data: string;
}

export interface ResponseServer {
    msg: string;
}

export interface UserLogin {
    idUsuario: number;
    message: string;
    email: string;
    client_id?: number;
    user_id?: number | 1;
    person_id: number;
    profile?: Profile;
    client_name?: string;
    social: boolean | false;
    first_name: string | null;
    last_name: string | null;
    roles?: Rol[];
}

export interface Rol {
    cons_usuario_rol_usuario: number;
    cons_usuario: number;
    cons_usuario_rol: number;
}
