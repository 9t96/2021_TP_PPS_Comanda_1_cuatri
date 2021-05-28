import { Usuario } from "../clases/usuario"
export interface firebaseUser {
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    profile?: Usuario;
}
