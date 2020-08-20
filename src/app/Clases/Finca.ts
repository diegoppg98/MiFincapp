import { Pivot } from './Pivot';

export class Finca {

    key: string;
    nombre: string;
    tamaño: string;
    cultivo: string;
    localizacion: string[];

  constructor(key: string, nombre: string, tamaño: string, cultivo: string, localizacion: string[]) {
    this.key = key;
    this.nombre = nombre;
    this.tamaño = tamaño;
    this.cultivo = cultivo;
    this.localizacion = localizacion;
  }

}

