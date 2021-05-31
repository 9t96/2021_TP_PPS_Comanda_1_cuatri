import { eEmpleado } from "../enums/eEmpleado";
import { eRol } from "../enums/eRol";

export class Usuario{
    nombre:string;
    apellido:string;
    correo: string;
    dni: string;
    cuil?: string;
    rol: eRol;
    img_src?: string;
    tipo_empleado?: eEmpleado;
}