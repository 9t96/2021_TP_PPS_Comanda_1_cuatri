import { eEstadoMesa } from "../enums/eEstadoMesa";
import { eTipoMesa } from "../enums/eTipoMesa";

export class Mesa{
    nro_mesa: number;
    comensales: number;
    tipo_mesa: eTipoMesa;
    estado: eEstadoMesa; 
    constructor(){
        this.estado = eEstadoMesa.LIBRE
    }
}