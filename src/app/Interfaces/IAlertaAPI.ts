import {Alerta} from '../Clases/Alerta';

export abstract class IAlertaAPI {
   /**
    * Creates a new alert in the database
    * @param {Alerta} object
    */
   abstract createAlert(alerta: Alerta) : Promise<string>;
   /**
    * Updates an alert from the database
    * @param {Alerta} object
    */
   abstract updateAlert(alerta: Alerta) : Promise<string>;
   /**
    * Deletes an alert from the database
    * @param {string} key - The key of the bot to delete
    */
   abstract deleteAlert(key: string) : Promise<string>;
   /**
    * Gets a lists of all alerts from the database that belong to a user
    */
   abstract listAlerts(): Promise<object[]>;
   /**
    * Gets one alert from the database
    * @param {string} key - The key of the alert
    */
   abstract alertInformation(key: string): Promise<object>;
}
