import firebase from 'firebase';
import {INotificacionAPI} from '../Interfaces/INotificacionAPI';
import {Notificacion} from '../Clases/Notificacion';


let notificationConverter = {
      toFirestore: function(notification : any) {
          return {
              medida: notification.medida,
              tiempo: notification.tiempo,
              alerta: notification.alerta
              }
      },
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
          return new Notificacion(snapshot.id,data.medida, data.tiempo, data.alerta)
      }
  }
  
export class FirebaseNotificacion extends INotificacionAPI{
 
 public createNotification(notification: Notification): Promise<string>{
   const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/notifications').withConverter(notificationConverter).add(notification)
        .then(function(docRef) {
          resolve('notification creada');
        })
        .catch(function(error) {
          reject(Error('Error createNotification'));
        });        
      } else {
        reject(Error('Error createNotification'));
      }
    });
    });

    return promise;
  }

  public deleteNotification(key: string): Promise<string>{
   const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/notifications').doc(key).delete()
         .then(function(docRef) {
           resolve('Notification eliminada');
         })
         .catch(function(error) {
           reject(Error('Error deleteNotification'));
         });
      } else {
        reject(Error('Error deleteNotification'));
      }      
     });
    });
    return promise;
  }
  public listNotification(): Promise<object[]>{
  const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
         let notificationsRef =  firebase.firestore().collection('users/' + user.uid + '/notifications').withConverter(notificationConverter);
          notificationsRef.get()
          .then(snapshot => {
            var notificaciones : Notificacion[] = [];
            snapshot.forEach(doc => {
              notificaciones.push(doc.data());
            });
           resolve(notificaciones);
          })
          .catch(err => {
          console.log(err);
            reject(Error('Error listNotification'));
          });          
        } else {
          reject(Error('Error listNotification'));
        }
      });
    });
    return promise;
  }
  public notificationInformation(key: string): Promise<object>{
  const promise = new Promise<object>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
         let notificationRef = firebase.firestore().collection('users/' + user.uid + '/notifications').doc(key).withConverter(notificationConverter);
          notificationRef.get()
          .then(doc => {
            if (!doc.exists) {
              reject(Error('Error notificationInformation'));
            } else {
              resolve(doc.data());
            }
          })
          .catch(err => {
            reject(Error('Error notificationInformation'));
          });
        } else {
          reject(Error('Error notificationInformation'));
        }
      });
    });
    return promise;
  }
 } 
