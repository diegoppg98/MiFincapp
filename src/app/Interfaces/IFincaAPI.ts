import {Finca} from '../Clases/Finca';

export abstract class IFincaAPI {
  /**
   * Creates a new land in the database
   * @param {Finca} object
   */
  abstract createLand(finca: Finca) : Promise<string>;
  /**
   * Updates a land from the database
   * @param {Finca} object
   */
  abstract updateLand(finca: Finca) : Promise<string>;
  /**
   * Deletes a land from the database
   * @param {string} key - The key of the land to delete
   */
  abstract deleteLand(key: string) : Promise<string>;
  /**
   * Gets a lists of all land from the database that belong to a user
   */
  abstract listLands(): Promise<object[]>;
  /**
   * Gets one land from the database
   * @param {string} key - The key of the device
   */
  abstract landInformation(key: string): Promise<object>;
}
