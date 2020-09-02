import {Dispositivo} from '../Clases/Dispositivo';

export abstract class IDispositivoAPI {
   /**
    * Creates a new device in the database
    * @param {Dispositivo} object
    */
   abstract createDevice(dispositivo : Dispositivo) : Promise<string>;
   /**
    * Updates a device from the database
    * @param {Dispositivo} object
    */
   abstract updateDevice(dispositivo : Dispositivo) : Promise<string>;
   /**
    * Deletes a device from the database
    * @param {Dispositivo} object
    */
   abstract deleteDevice(dispositivo : Dispositivo) : Promise<string>;
   /**
    * Gets a lists of all devices from the database that belong to a pivot
    * @param {string} key - The key of the pivot
    */
   abstract listDevices(key: string): Promise<object[]>;
   /**
    * Gets one device from the database
    * @param {string} key - The key of the device
    */
   abstract deviceInformation(key: string): Promise<object>;

   abstract deviceExist(id: string): Promise<string>;
   /**
    * Checks if the device is already registered in the database
    * @param {string} id - The id of the device
    */
   abstract checkDeviceId(id: string): Promise<object>;
}
