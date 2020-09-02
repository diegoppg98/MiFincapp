import { Dispositivo } from './Dispositivo';

export class Pivot {

  key: string;
  nombre: string;
  tipo: string;
  localizacion: string[];
  finca: string;
  posActual: string[];
  constructor(key: string, nombre: string, tipo: string, localizacion: string[], finca: string,posActual: string[]) {
    this.key = key;
    this.nombre = nombre;
    this.tipo = tipo;
    this.localizacion = localizacion;
    this.finca = finca;
    this.posActual = posActual;
  }

}
