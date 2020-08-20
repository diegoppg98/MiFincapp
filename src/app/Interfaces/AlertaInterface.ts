import {Alerta} from '../Clases/Alerta';

export interface AlertaInterface {
   createAlert(alerta: Alerta) : Promise<any>;
   updateAlert(alerta: Alerta) : Promise<any>;
   deleteAlert(key: string) : Promise<any>;
   listAlerts(): Promise<any>;
   alertInformation(key: string): Promise<any>;
}
