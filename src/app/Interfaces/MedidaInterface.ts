import {Medida} from '../Clases/Medida';

export interface MedidaInterface {
  listMeasurements(idDevice: string, limit:number): Promise<any>;
  checkDeviceMeasurement(idDevice: string): Promise<any>;
  createMeasurement(medida: Medida) : Promise<any>;
}
