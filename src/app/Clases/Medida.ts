
export class Medida {

  key: string;
  id: string;
  medida: string[];
  chequeada: boolean;
  notificada: boolean;
  tiempo: string;  
    

  constructor(key: string, id: string, medida: string[], chequeada: boolean, notificada: boolean, tiempo: string) {
    this.key = key;
    this.id = id;
    this.medida = medida;
    this.chequeada = chequeada;  
    this.notificada = notificada;
    this.tiempo = tiempo;
  }

}
