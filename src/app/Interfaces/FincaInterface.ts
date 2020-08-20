import {Finca} from '../Clases/Finca';

export interface FincaInterface {
  createLand(finca: Finca) : Promise<any>;
  updateLand(finca: Finca) : Promise<any>;
  deleteLand(key: string) : Promise<any>;
  listLands(): Promise<any>;
  landInformation(key: string): Promise<any>;
}
