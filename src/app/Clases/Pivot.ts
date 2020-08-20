import { Dispositivo } from './Dispositivo';

export class Pivot {

  key: string;
  nombre: string;
  tipo: string;
  localizacion: string[];
  finca: string;
    
  constructor(key: string, nombre: string, tipo: string, localizacion: string[], finca: string) {
    this.key = key;
    this.nombre = nombre;
    this.tipo = tipo;
    this.localizacion = localizacion;
    this.finca = finca;
  }

}
