import firebase from 'firebase';
import {DispositivoInterface} from '../Interfaces/DispositivoInterface';
import {Dispositivo} from '../Clases/Dispositivo';
import {DispositivoGps} from '../Clases/Dispositivo';
import {DispositivoTemperatura} from '../Clases/Dispositivo';
import {FirebaseAlerta} from '../Firebase/FirebaseAlerta';
let FunctionsAlerta: FirebaseAlerta = new FirebaseAlerta();
 
 let dispositivoGpsConverter = {
      toFirestore: function(dispositivo) {
          return {              
              nombre: dispositivo.nombre,
              id: dispositivo.id,
              tipo: dispositivo.tipo,
              localizacion: dispositivo.localizacion,
              finca: dispositivo.finca,
              pivot: dispositivo.pivot,
              localizacionesPosibles: dispositivo.posiblesLocalizaciones,
          }
      }, 
      fromFirestore: function(snapshot, options){
          const data = snapshot.data(options);
          return new DispositivoGps(snapshot.id,data.nombre, data.id, data.tipo, data.localizacion, data.finca, data.pivot, data.localizacionesPosibles)
      }
  }
  
  let dispositivoTemperaturaConverter = {
      toFirestore: function(dispositivo) {
          return {              
              nombre: dispositivo.nombre,
              id: dispositivo.id,
              tipo: dispositivo.tipo,
              localizacion: dispositivo.localizacion,
              finca: dispositivo.finca,
              pivot: dispositivo.pivot,
              temperatura: dispositivo.temperatura,
          }
      }, 
      fromFirestore: function(snapshot, options){
          const data = snapshot.data(options);
          return new DispositivoTemperatura(snapshot.id,data.nombre, data.id, data.tipo, data.localizacion, data.finca, data.pivot, data.temperatura)
      }
  }
 
 export class FirebaseDispositivo implements DispositivoInterface{
 
  public createDevice(dispositivo : Dispositivo) : Promise<any>{  
   const promise = new Promise(function(resolve, reject) {
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
        else if (dispositivo instanceof DispositivoTemperatura){
          firebase.firestore().collection('users/' + user.uid + '/devices').withConverter(dispositivoTemperaturaConverter).add(dispositivo)
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

  public updateDevice(dispositivo : Dispositivo) : Promise<any>{
  const promise = new Promise(function(resolve, reject) {
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
       else if(dispositivo instanceof DispositivoTemperatura){
        firebase.firestore().collection('users/' + user.uid + '/devices/').doc(dispositivo.key).withConverter(dispositivoTemperaturaConverter).set(dispositivo)
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

  public deleteDevice(dispositivo : Dispositivo) : Promise<any>{
  const promise = new Promise(function(resolve, reject) {
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
             result.forEach(function(childResult) {       
             if(childResult.nombreDispositivo === dispositivo.key)
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

  public listDevices(keyPivot: string): Promise<any> {   
  const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          var dispositivos = [];
        let devicesTempRef = firebase.firestore().collection('users/' + user.uid + '/devices').where('pivot', '==', keyPivot).where('tipo', '==', "Temperatura").withConverter(dispositivoTemperaturaConverter);
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

  public deviceInformation(key: string): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
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
            else if (doc.data().tipo == 'Temperatura'){
              let deviceTemp = firebase.firestore().collection('users/' + user.uid + '/devices').doc(key).withConverter(dispositivoTemperaturaConverter).get()
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
  
  checkDeviceId(idDevice: string): Promise<any>{
  const promise = new Promise(function(resolve, reject) {
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
