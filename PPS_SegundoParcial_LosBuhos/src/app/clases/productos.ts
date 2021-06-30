import { eProducto } from "../enums/eProducto";

export class Productos{
    nombre: string;
    descripcion: string;
    tiempo_elaboracion: number;
    precio: number;
    img_src: string[];
    sector: eProducto;
}