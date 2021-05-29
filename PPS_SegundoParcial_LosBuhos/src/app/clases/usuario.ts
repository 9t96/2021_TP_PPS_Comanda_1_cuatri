import { Rol } from "../enums/roles";

export class Usuario{
    nombre:string;
    apellido:string;
    correo: string;
    dni: string;
    cuil?: string;
    rol: Rol;
    img_src?: string;
    tipo_empleado?: Rol;
}