
import {FirebaseFinca} from './Firebase/FirebaseFinca';
import {FirebasePivot} from './Firebase/FirebasePivot';
import {FirebaseDispositivo} from './Firebase/FirebaseDispositivo';
import {FirebaseNotificacion} from './Firebase/FirebaseNotificacion';
import {FirebaseMedida} from './Firebase/FirebaseMedida';
import {FirebaseAlerta} from './Firebase/FirebaseAlerta';
import {FirebaseUser} from './Firebase/FirebaseUser';
import {AbstractFactoryAPI} from './AbstractFactoryAPI';

export class FirebaseFactoryAPI implements AbstractFactoryAPI{
     getFinca(): FirebaseFinca {
        return new FirebaseFinca();
    }
     getPivot(): FirebasePivot {
        return new FirebasePivot();
    }
     getDispositivo(): FirebaseDispositivo {
        return new FirebaseDispositivo();
    }
     getAlerta(): FirebaseAlerta {
        return new FirebaseAlerta();
    }
     getNotificacion(): FirebaseNotificacion {
        return new FirebaseNotificacion();
    }
     getMedida(): FirebaseMedida {
        return new FirebaseMedida();
    }
     getUsuario(): FirebaseUser {
        return new FirebaseUser();
    }
}
