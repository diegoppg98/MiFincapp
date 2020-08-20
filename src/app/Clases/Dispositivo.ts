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
  
  constructor(key: string, nombre: string, id: string, tipo: string, localizacion: string[], finca: string, pivot: string,posiblesLocalizaciones:object[]) {
  super(key, nombre, id, tipo, localizacion, finca, pivot);
    this.posiblesLocalizaciones = posiblesLocalizaciones;
  }

}

export class DispositivoTemperatura extends Dispositivo {

  temperatura: string;

  constructor(key: string, nombre: string, id: string, tipo: string, localizacion: string[], finca: string, pivot: string,temperatura: string) {
  super(key, nombre, id, tipo, localizacion, finca, pivot);
    this.temperatura = temperatura;
  }

}
