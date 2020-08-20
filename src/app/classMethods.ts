
import {FirebaseFinca} from './Firebase/FirebaseFinca';
import {FirebasePivot} from './Firebase/FirebasePivot';
import {FirebaseDispositivo} from './Firebase/FirebaseDispositivo';
import {FirebaseNotificacion} from './Firebase/FirebaseNotificacion';
import {FirebaseMedida} from './Firebase/FirebaseMedida';
import {FirebaseAlerta} from './Firebase/FirebaseAlerta';
import {FirebaseUser} from './Firebase/FirebaseUser';
import {classMethodsInterface} from './classMethodsInterface';

export class classMethods implements classMethodsInterface{
    static getFincaMethods(): FirebaseFinca {
        return new FirebaseFinca();
    }
    static getPivotMethods(): FirebasePivot {
        return new FirebasePivot();
    }
    static getDispositivoMethods(): FirebaseDispositivo {
        return new FirebaseDispositivo();
    }
    static getAlertaMethods(): FirebaseAlerta {
        return new FirebaseAlerta();
    }
    static getNotificacionMethods(): FirebaseNotificacion {
        return new FirebaseNotificacion();
    }
    static getMedidaMethods(): FirebaseMedida {
        return new FirebaseMedida();
    }
    static getUsuarioMethods(): FirebaseUser {
        return new FirebaseUser();
    }
}
