
export class Notificacion {

  key: string;
  medida: string
  tiempo: string;  
  alerta: string;  

  constructor(key: string, medida: string, tiempo: string, alerta: string) {
    this.key = key;
    this.medida = medida;
    this.tiempo = tiempo;
    this.alerta = alerta;  
  }

}
