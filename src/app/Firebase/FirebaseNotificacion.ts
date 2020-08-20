import firebase from 'firebase';
import {NotificacionInterface} from '../Interfaces/NotificacionInterface';
import {Notificacion} from '../Clases/Notificacion';


let notificationConverter = {
      toFirestore: function(notification) {
          return {
              medida: notification.medida,
              tiempo: notification.tiempo,
              alerta: notification.alerta
              }
      },
      fromFirestore: function(snapshot, options){
          const data = snapshot.data(options);
          return new Notificacion(snapshot.id,data.medida, data.tiempo, data.alerta)
      }
  }
  
export class FirebaseNotificacion implements NotificacionInterface{
 
 public createNotification(notification: Notification): Promise<any>{
   const promise = new Promise(function(resolve, reject) {
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

  public deleteNotification(key: string): Promise<any>{
   const promise = new Promise(function(resolve, reject) {
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
  public listNotification(): Promise<any>{
  const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
         let notificationsRef =  firebase.firestore().collection('users/' + user.uid + '/notifications').withConverter(notificationConverter);
          notificationsRef.get()
          .then(snapshot => {
            var notificaciones = [];
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
  public notificationInformation(key: string): Promise<any>{
  const promise = new Promise(function(resolve, reject) {
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
