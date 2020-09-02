import firebase from 'firebase';
import {IDispositivoAPI} from '../Interfaces/IDispositivoAPI';
import {Dispositivo} from '../Clases/Dispositivo';
import {DispositivoGps} from '../Clases/Dispositivo';
import {DispositivoSuelo} from '../Clases/Dispositivo';
import {FirebaseAlerta} from '../Firebase/FirebaseAlerta';
import { Alerta } from '../Clases/Alerta';
let FunctionsAlerta: FirebaseAlerta = new FirebaseAlerta();
 
 let dispositivoGpsConverter = {
      toFirestore: function(dispositivo : any) {
          return {              
              nombre: dispositivo.nombre,
              id: dispositivo.id,
              tipo: dispositivo.tipo,
              localizacion: dispositivo.localizacion,
              finca: dispositivo.finca,
              pivot: dispositivo.pivot,
              localizacionesPosibles: dispositivo.posiblesLocalizaciones,
              posActual: dispositivo.posActual,
          }
      }, 
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
          return new DispositivoGps(snapshot.id,data.nombre, data.id, data.tipo, data.localizacion, data.finca, data.pivot, data.localizacionesPosibles,data.posActual)
      }
  }
  
  let dispositivoSueloConverter = {
      toFirestore: function(dispositivo : any) {
          return {              
              nombre: dispositivo.nombre,
              id: dispositivo.id,
              tipo: dispositivo.tipo,
              localizacion: dispositivo.localizacion,
              finca: dispositivo.finca,
              pivot: dispositivo.pivot,
              suelo: dispositivo.suelo,
          }
      }, 
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
          return new DispositivoSuelo(snapshot.id,data.nombre, data.id, data.tipo, data.localizacion, data.finca, data.pivot, data.suelo)
      }
  }
 
 export class FirebaseDispositivo extends IDispositivoAPI{
 
  public createDevice(dispositivo : Dispositivo) : Promise<string>{  
   const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {       
        if(dispositivo instanceof DispositivoGps){
          firebase.firestore().collection('users/' + user.uid + '/devices').withConverter(dispositivoGpsConverter).add(dispositivo)
          .then(function(docRef) {
            firebase.firestore().collection('devices/').doc(dispositivo.id).set({
              user: user.uid,
              device: docRef.id,
            });
            resolve('Dispositivo creada');
          })
        }
        else if (dispositivo instanceof DispositivoSuelo){
          firebase.firestore().collection('users/' + user.uid + '/devices').withConverter(dispositivoSueloConverter).add(dispositivo)
          .then(function(docRef) { 
           firebase.firestore().collection('devices/').doc(dispositivo.id).set({
            user: user.uid,
            device: docRef.id,
          });
            resolve('Dispositivo creada');
          })
        }
        else 
          reject(Error('Error createDevice'));
        } else {
        reject(Error('Error createDevice'));
        }
      });
    });
    return promise;   
  }

  public updateDevice(dispositivo : Dispositivo) : Promise<string>{
  const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      if(dispositivo instanceof DispositivoGps){
        firebase.firestore().collection('users/' + user.uid + '/devices/').doc(dispositivo.key).withConverter(dispositivoGpsConverter).set(dispositivo)
         .then(function(docRef) {
           resolve('dispositivo actualizada');
         })
         .catch(function(error) {
           reject(Error('Error updateDevice'));
         });
       }
       else if(dispositivo instanceof DispositivoSuelo){
        firebase.firestore().collection('users/' + user.uid + '/devices/').doc(dispositivo.key).withConverter(dispositivoSueloConverter).set(dispositivo)
         .then(function(docRef) {
           resolve('dispositivo actualizada');
         })
         .catch(function(error) {
           reject(Error('Error updateDevice'));
         });
       }
       else 
         reject(Error('Error updateDevice'));
      } else {
        reject(Error('Error updateDevice'));
      }
    });
     });
     return promise;  
  }

  public deleteDevice(dispositivo : Dispositivo) : Promise<string>{
  const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      
        firebase.firestore().collection('users/' + user.uid + '/devices').doc(dispositivo.key).delete()
         .then(function(docRef) {
           firebase.firestore().collection('devices/').doc(dispositivo.id).delete()
           resolve('dispositivo eliminada');
         })
         .catch(function(error) {
           reject(Error(error));
         });   
        
        FunctionsAlerta.listAlerts().then((result) =>{
           if(result !== null){
             result.forEach(function(childResult : Alerta) {       
             if(childResult.dispositivo === dispositivo.key)
               FunctionsAlerta.deleteAlert(childResult.key);
             })
           }
         });
      } else {
        reject(Error('Error deleteDevice'));
      }
    });
   });
   return promise;  
  }

  public listDevices(keyPivot: string): Promise<object[]> {   
  const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          var dispositivos : Dispositivo[] = [];
        let devicesTempRef = firebase.firestore().collection('users/' + user.uid + '/devices').where('pivot', '==', keyPivot).where('tipo', '==', "Suelo").withConverter(dispositivoSueloConverter);
          let devicesTemp = await devicesTempRef.get();     
            devicesTemp.forEach(doc => {
                dispositivos.push(doc.data());
            });  
                            
          let devicesGpsRef =  firebase.firestore().collection('users/' + user.uid + '/devices').where('pivot', '==', keyPivot).where('tipo', '==', "GPS").withConverter(dispositivoGpsConverter);
          let devicesGps = await devicesGpsRef.get();             
            devicesGps.forEach(doc => {
                dispositivos.push(doc.data());
            });          
          
          resolve(dispositivos);                  
        } else {
          reject(Error('Error listDevices'));
        }
      });
    });

    return promise;
  }

  public deviceInformation(key: string): Promise<object> {
    const promise = new Promise<object>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {      
        let devicesRef = firebase.firestore().collection('users/' + user.uid + '/devices').doc(key);
          devicesRef.get()
          .then(doc => {
            if (!doc.exists) {
              reject(Error('Error deviceInformation'));
            } else {
            if(doc.data().tipo == 'GPS'){
              let deviceGps = firebase.firestore().collection('users/' + user.uid + '/devices').doc(key).withConverter(dispositivoGpsConverter).get()
              .then(doc => {
                if (!doc.exists) {
                 reject(Error('Error deviceInformation'));
                }
                else {
                 resolve(doc.data());
                }
              })
              .catch(err => {
                reject(Error('Error deviceInformation'));
              });          
            }
            else if (doc.data().tipo == 'Suelo'){
              let deviceTemp = firebase.firestore().collection('users/' + user.uid + '/devices').doc(key).withConverter(dispositivoSueloConverter).get()
              .then(doc => {
               if (!doc.exists) {
                reject(Error('Error deviceInformation'));
               }
               else {
                 resolve(doc.data());
               }
              })
              .catch(err => {
               reject(Error('Error deviceInformation'));
              });
            }
            else {
             reject(Error('Error deviceInformation'));
            }
           }            
          })
          .catch(err => {
            reject(Error('Error deviceInformation'));
          });
        } else {
          reject(Error('Error deviceInformation'));
        }
      });
    });

    return promise;
  }
  
  public deviceExist(id: string): Promise<string> {
    const promise = new Promise<string>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
        let deviceRef =  firebase.firestore().collection('devices').doc(id);
          deviceRef.get()
          .then(snapshot => {
            if (snapshot.exists) {
              reject(Error('id en uso'));
            } else {
              resolve('id libre');
            }       
        });         
        } else {
          reject(Error('Error deviceExist'));
        }
      });
    });
    return promise;
  }
  
  checkDeviceId(idDevice: string): Promise<object>{
  const promise = new Promise<object>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {       
        let deviceRef = firebase.firestore().collection('devices/').doc(idDevice);
          deviceRef.get()
          .then(doc => {
            if (!doc.exists) { 
              reject(Error('Error checkDeviceId'));
            } else {
              resolve(doc.data());
            }
          })
          .catch(err => {
            reject(Error('Error landInformation'));
          });           
        } else {
          reject(Error('Error checkDeviceId'));
        }
      });
    });
    return promise;
  }
  
  }
