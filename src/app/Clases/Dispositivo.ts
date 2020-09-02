import { Alerta } from './Alerta';
import { Medida } from './Medida';

export class Dispositivo {

  key: string;
  nombre: string;
  id: string;
  tipo: string;
  finca: string;
  pivot: string;
  localizacion: string[];

  constructor(key: string, nombre: string, id: string, tipo: string, localizacion: string[], finca: string, pivot: string) {
    this.key = key;
    this.nombre = nombre;
    this.id = id;
    this.tipo = tipo;
    this.localizacion = localizacion;
    this.finca = finca;
    this.pivot = pivot;
  }

}

export class DispositivoGps extends Dispositivo {

  posiblesLocalizaciones: object[];
  posActual: string[];

  constructor(key: string, nombre: string, id: string, tipo: string, localizacion: string[], finca: string, pivot: string,posiblesLocalizaciones:object[],posActual: string[]) {
  super(key, nombre, id, tipo, localizacion, finca, pivot);
    this.posiblesLocalizaciones = posiblesLocalizaciones;
    this.posActual = posActual;
  }

}

export class DispositivoSuelo extends Dispositivo {

  suelo: string;

  constructor(key: string, nombre: string, id: string, tipo: string, localizacion: string[], finca: string, pivot: string,suelo: string) {
  super(key, nombre, id, tipo, localizacion, finca, pivot);
    this.suelo = suelo;
  }

}
