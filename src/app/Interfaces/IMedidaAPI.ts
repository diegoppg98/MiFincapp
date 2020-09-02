import {Medida} from '../Clases/Medida';

export abstract class IMedidaAPI {
  /**
   * Gets a lists of measurement from the database that belong to a device
   * @param {string} idDevice - The key of the device
   * @param {string} limit - The numbre of measurement that list
   */
  abstract listMeasurements(idDevice: string, limit:number): Promise<object[]>;
  /**
   * Checks if exist a measurement of the device
   * @param {Medida} object
   */
  abstract checkDeviceMeasurement(idDevice: string): Promise<object[]>;
  /**
   * Creates a new measurement in the database
   * @param {Medida} object
   */
  abstract createMeasurement(medida: Medida) : Promise<string>;
}
