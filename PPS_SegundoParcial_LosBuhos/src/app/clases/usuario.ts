import { IRol } from "../interfaces/rol";

export class Usuario{
    nombre:string;
    apellido?:string;
    correo: string;
    dni?: string;
    cuil?: string;
    rol: IRol;
    img_src?: string;
    tipo_empleado?: IRol;
}