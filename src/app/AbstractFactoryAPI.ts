import {IFincaAPI} from './Interfaces/IFincaAPI';
import {IPivotAPI} from './Interfaces/IPivotAPI';
import {IDispositivoAPI} from './Interfaces/IDispositivoAPI';
import {INotificacionAPI} from './Interfaces/INotificacionAPI';
import {IMedidaAPI} from './Interfaces/IMedidaAPI';
import {IAlertaAPI} from './Interfaces/IAlertaAPI';
import {IUsuarioAPI} from './Interfaces/IUsuarioAPI';

export interface AbstractFactoryAPI {
     /**
      * Gets a API of lands
      */ 
     getFinca(): IFincaAPI;
     /**
      * Gets a API of pivots
      */ 
     getPivot(): IPivotAPI;
     /**
      * Gets a API of devices
      */ 
     getDispositivo(): IDispositivoAPI;
     /**
      * Gets a API of alerts
      */ 
     getAlerta(): IAlertaAPI;
     /**
      * Gets a API of notifications
      */ 
     getNotificacion(): INotificacionAPI;
     /**
      * Gets a API of measurements
      */ 
     getMedida(): IMedidaAPI;
     /**
      * Gets a API of users
      */ 
     getUsuario(): IUsuarioAPI;
}
