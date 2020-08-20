import {Pivot} from '../Clases/Pivot';

export interface PivotInterface {
   createPivot(pivot : Pivot) : Promise<any>;
   updatePivot(pivot : Pivot) : Promise<any>;
   deletePivot(key: string) : Promise<any>;
   listPivots(keyLand: string): Promise<any>;
   pivotInformation(key: string): Promise<any>;
}
