import {FirebaseFinca} from './Interfaces/FincaInterface';
import {FirebasePivot} from './Interfaces/PivotInterface';
import {FirebaseDispositivo} from './Interfaces/DispositivoInterface';
import {FirebaseNotificacion} from './Interfaces/NotificacionInterface';
import {FirebaseMedida} from './Interfaces/MedidaInterface';
import {FirebaseAlerta} from './Interfaces/AlertaInterface';
import {FirebaseUser} from './Interfaces/UserInterface';

export interface classMethodsInterface {
     getFincaMethods(): FincaInterface;
     getPivotMethods(): PivotInterface;
     getDispositivoMethods(): DispositivoInterface;
     getAlertaMethods(): AlertaInterface;
     getNotificacionMethods(): NotificacionInterface;
     getMedidaMethods(): MedidaInterface;
     getUsuarioMethods(): UserInterface;
}
