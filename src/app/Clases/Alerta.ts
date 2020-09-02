import { Notificacion } from './Notificacion';

export class Alerta {

  key: string;
  nombre: string;  
  tipo: string;
  datos: string[];
  opcion: string;
  tiempo: string;
  tiempoUltimaAlerta: string;
  silenciada: boolean;
  tierra: string;
  pivot: string;
  dispositivo: string;

  constructor(key: string, nombre: string, tipo: string, datos: string[], opcion: string, tiempo: string, tiempoUltimaAlerta: string, silenciada: boolean, tierra: string, pivot: string, dispositivo: string) {
    this.key = key;
    this.nombre = nombre;
    this.tipo = tipo;
    this.datos = datos;
    this.opcion = opcion;
    this.tiempo = tiempo;
    this.tiempoUltimaAlerta = tiempoUltimaAlerta;
    this.silenciada = silenciada;
    this.tierra = tierra;
    this.pivot = pivot;
    this.dispositivo = dispositivo;
  }

}
