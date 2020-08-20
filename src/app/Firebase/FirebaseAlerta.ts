import firebase from 'firebase';
import {Alerta} from '../Clases/Alerta';
import {AlertaInterface} from '../Interfaces/AlertaInterface';
import {FirebaseNotificacion} from '../Firebase/FirebaseNotificacion';
let FunctionsNotificacion: FirebaseNotificacion = new FirebaseNotificacion();

let alertaConverter = {
      toFirestore: function(alerta) {
          return {
              nombre: alerta.nombre,
              tipo: alerta.tipo,
              opcionAlerta: alerta.opcion,
              datosAlerta: alerta.datos,
              silenciada: alerta.silenciada,
              tiempoAlerta: alerta.tiempo,
              tiempoUltimaAlerta: alerta.tiempoUltimaAlerta,
              tierra: alerta.tierra,
              pivot: alerta.pivot,
              dispositivo: alerta.dispositivo
              }
      },
      fromFirestore: function(snapshot, options){
          const data = snapshot.data(options);
          return new Alerta(snapshot.id,data.nombre, data.tipo, data.datosAlerta, data.opcionAlerta, data.tiempoAlerta, data.tiempoUltimaAlerta, data.silenciada, data.tierra, data.pivot, data.dispositivo)
      }
  }
  
  export class FirebaseAlerta implements AlertaInterface{

   public createAlert(alerta: Alerta) : Promise<any>{
    const promise = new Promise(function(resolve, reject) {
     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/alerts').withConverter(alertaConverter).add(alerta)
        .then(function(docRef) {
          resolve(docRef.id);
        })
        .catch(function(error) {
          reject(Error('Error createAlert'));
        }); 
       } else {
        reject(Error('Error createAlert'));
       }
     });
    });
    return promise;
  }

  public updateAlert(alerta: Alerta) : Promise<any> {
   const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      firebase.firestore().collection('users/'+ user.uid + '/alerts/').doc(alerta.key).withConverter(alertaConverter).set(alerta)
         .then(function(docRef) {
           resolve('alerta actualizada');
         })
         .catch(function(error) {
           reject(Error('Error updateAlert'));
         });
      } else {
        return null;
      }
     });
    });
    return promise;
  }

  public deleteAlert(key: string) : Promise<any> {
    const promise = new Promise(function(resolve, reject) {
     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/alerts').doc(key).delete()
         .then(function(docRef) {
           resolve('alerta eliminada');
         })
         .catch(function(error) {
           reject(Error('Error deleteAlert'));
         });
         FunctionsNotificacion.listNotification().then((result) =>{
           if(result !== null){
             result.forEach(function(childResult) {       
             if(childResult.alerta === key)
               FunctionsNotificacion.deleteNotification(childResult.key);
             })
           }
         });
      } else {
        reject(Error('Error deleteAlert'));
      }
     });
    });
    return promise;
  }

  public listAlerts(): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {       
         let alertsRef =  firebase.firestore().collection('users/' + user.uid + '/alerts').withConverter(alertaConverter);
          alertsRef.get()
          .then(snapshot => {
            var alertas = [];
            snapshot.forEach(doc => {
              alertas.push(doc.data());
            });
           resolve(alertas);
          })
          .catch(err => {
            reject(Error('Error listAlerts'));
          }); 
        } else {
          reject(Error('Error listAlerts'));
        }
      });
    });
    return promise;
  }

  public alertInformation(key: string): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {       
        let alertRef = firebase.firestore().collection('users/' + user.uid + '/alerts').doc(key).withConverter(alertaConverter);
          alertRef.get()
          .then(doc => {
            if (!doc.exists) {
              reject(Error('Error alertInformation'));
            } else {
              resolve(doc.data());
            }
          })
          .catch(err => {
            reject(Error('Error alertInformation'));
          }); 
        } else {
          reject(Error('Error alerInformation'));
        }
      });
    });
    return promise;
  }
}
