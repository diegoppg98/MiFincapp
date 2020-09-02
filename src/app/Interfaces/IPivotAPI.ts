import {Pivot} from '../Clases/Pivot';

export abstract class IPivotAPI {
   /**
    * Creates a new pivot in the database
    * @param {Pivot} object
    */
   abstract createPivot(pivot : Pivot) : Promise<string>;
   /**
    * Updates a pivot from the database
    * @param {Pivot} object
    */
   abstract updatePivot(pivot : Pivot) : Promise<string>;
   /**
    * Deletes a pivot from the database
    * @param {string} key - The key of the pivot to delete
    */
   abstract deletePivot(key: string) : Promise<string>;
   /**
    * Gets a lists of all pivot from the database that belong to a land
    * @param {string} key - The key of the land
    */
   abstract listPivots(keyLand: string): Promise<object[]>;
   /**
    * Gets one pivot from the database
    * @param {string} key - The key of the device
    */
   abstract pivotInformation(key: string): Promise<object>;
}
