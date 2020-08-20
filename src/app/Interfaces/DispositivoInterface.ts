import {Dispositivo} from '../Clases/Dispositivo';

export interface DispositivoInterface {
   createDevice(dispositivo : Dispositivo) : Promise<any>;
   updateDevice(dispositivo : Dispositivo) : Promise<any>;
   deleteDevice(dispositivo : Dispositivo) : Promise<any>;
   listDevices(key: string): Promise<any>;
   deviceInformation(key: string): Promise<any>;
   deviceExist(id: string): Promise<string>;
   checkDeviceId(id: string): Promise<any>;
}
