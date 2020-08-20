import { Database } from './interfaceDatabase';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDvNNc2-XaHTnZDDy6g_uTEciVqc3z8nfc',
  authDomain: 'pivot-2f31f.firebaseapp.com',
  databaseURL: 'https://pivot-2f31f.firebaseio.com',
  projectId: 'pivot-2f31f',
  storageBucket: 'pivot-2f31f.appspot.com',
  messagingSenderId: '919977317494',
  appId: '1:919977317494:web:ea08bb9e69e0ba7303bb57',
};

export class ImplementationDatabase implements Database {

  public init() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  public login(mail: string, pass: string) {
    const promise = new Promise(function(resolve, reject) {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then(
          (user) => {
            //const userMail = firebase.auth().currentUser;
          //  console.log(userMail.emailVerified);
            resolve('Correo no verificado, por favor revise su correo y confirme su cuenta');
          },
          (error) => reject(Error('Datos incorrectos')),
        );
    });
    return promise;
  }


  public changePassword(name: string, pass: string, newPass: string) {
    const promise = new Promise(function(resolve, reject) {
           firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                 const userMail = firebase.auth().currentUser;
                 const cred = firebase.auth.EmailAuthProvider.credential(name, pass);
                 userMail.reauthenticateWithCredential(cred).then(() => {
                    userMail.updatePassword(newPass).then(() => {
                       resolve('Contraseña cambiada correctamente');
                    }).catch((error) => {
                       reject(Error('Error al intentar cambiar la contraseña. Por favor intentelo otra vez'));
                    });
                 }).catch((error) => { 
                    reject(Error('Contraseña actual incorrecta. Por favor intentelo otra vez'));
                 });
              } else {
                reject(Error('Error userInformation'));
              }
          });
    });
    return promise;
  }

  public forgetPassword(name: string){
    const promise = new Promise(function(resolve, reject) {
        firebase.auth().languageCode = 'es';
        firebase.auth().sendPasswordResetEmail(name).then(() => {
            resolve('Contraseña enviada al correo');
        }).catch((error) => { 
            reject(Error('Datos incorrectos'));
        });
    });
    return promise;
  }


  public logout() {
     firebase.auth().signOut().then(function() {
        console.log('DESC');
        //router.push('/');
     }).catch(function(error) {
       //console.log(error);
    });
  }
  
  public appIcon(): Promise<string>{
  const promise = new Promise<string>(function(resolve) {
      const ref = firebase.storage().ref('miFincappIcon.png');
     ref.getDownloadURL().then(function(url) {
         resolve(url);                           
     });                
    });
    return promise;    
  }
     
  public userProfileIcon(): Promise<string>{
  const promise = new Promise<string>(function(resolve) {
      const ref = firebase.storage().ref('userPicture');
      var pictureRef = ref.child('userProfile.jpg');
     pictureRef.getDownloadURL().then(function(url) {
         resolve(url);                           
     });                
    });
    return promise;    
  }

  public createUser(mail: string, pass: string, name: string, picture: object, address: string) {
    const db = firebase.database();
    const promise = new Promise(function(resolve, reject) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then(
          (result) => {
            firebase.auth().onAuthStateChanged(function(user) {
            console.log(user);
              if (user) {
                var foto = '';
                if (picture){
                   const ref = firebase.storage().ref('userPicture');
                   const metadata = { contentType: picture.type };
                   const task = ref.child(mail).put(picture,metadata);
                   var pictureRef = ref.child(mail);
                   pictureRef.getDownloadURL().then(function(url) {
                     foto = url;
                     db.ref('users/' + user.uid).push({
                       correo: [mail],
                       nombre: [name],
                       direccion: [address],
                       foto: [foto],
                     });
                    db.ref('users/' + user.uid).set({
                      correo: [mail],
                      nombre: [name],
                      direccion: [address],
                      foto: [foto],
                    });
                   });
                }
                else{
                  db.ref('users/' + user.uid).push({
                    correo: [mail],
                    nombre: [name],
                    direccion: [address],
                    foto: [foto],
                  });
                  db.ref('users/' + user.uid).set({
                    correo: [mail],
                    nombre: [name],
                    direccion: [address],
                    foto: [foto],
                  });
                }
                firebase.auth().languageCode = 'es';
                user.sendEmailVerification().catch(function(error) {
                  reject(Error(error));
                });                
              }
            });
            //firebase.auth().signOut();
            resolve('Usuario creado correctamente');
            
          },
          (error) => reject(Error(error)),
        );
    });
    return promise;
  }

  public updateUser(mail: string, pass: string, name: string, picture: object, address: string): Promise<any> {
const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         var foto = '';
       if (picture){
          const ref = firebase.storage().ref('userPicture');
          const metadata = { contentType: picture.type };
          const task = ref.child(mail).put(picture,metadata);
          var pictureRef = ref.child(mail);
          pictureRef.getDownloadURL().then(function(url) {
             foto = url;
             const db = firebase.database();
             db.ref('users/' + user.uid).update({
               correo: [mail],
               nombre: [name],
               direccion: [address],
               foto: [foto],
             });
          });
       }
       else{
        const db = firebase.database();
        db.ref('users/' + user.uid).update({
          correo: [mail],
          nombre: [name],
          direccion: [address],
          foto: [foto],
        });
       } 
      resolve('Actualizado');
      } else {
        reject(Error('Error updateUser'));
      }
    });
   });
return promise;
  }

  public deleteUser() {
  const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid);      
        user
          .delete()
          .then(function() {
            UserRef.remove();
            resolve('Usuario eliminado');
          })
          .catch(function(error) {
            reject(Error('Error deleteUser'));
          });
      } else {
        reject(Error('Error deleteUser'));
      }
    });
    });
    return promise;
  }

  public userInformation(): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let name;
          const UserRef = firebase.database().ref('users/' + user.uid);
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();
              const obj2 = Object.values(obj);
              name = obj.nombre[0];
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error userInformation'));
        }
      });
    });
    return promise;
  }

  public createLand(name: string, location: string[], size: string, crop: string) : Promise<any>{
const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/lands');
        UserRef.once('value').then(function(snapshot) {
          db.ref('users/' + user.uid + '/lands').push({
            nombre: [name],
            localizacion: [location],
            tamaño: [size],
            cultivo: [crop],
          });
        resolve('Tierra creada');
        });
      } else {
        reject(Error('Error createLands'));
      }
    });
    });

    return promise;
  }

  public updateLand(key: string, name: string, location: string[], size: string, crop: string) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        db.ref('users/' + user.uid + '/lands/' + key).update({
          nombre: [name],
          localizacion: [location],
          tamaño: [size],
          cultivo: [crop],
        });
      } else {
        return null;
      }
    });
  }

  public deleteLand(key: string) {
    var pivots = this.listPivots.bind(this);
    var pivotDelete = this.deletePivot.bind(this);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/lands/' + key);
        pivots(key).then((result) =>{
          if(result !== null){
            result.forEach(function(childResult) {       
              pivotDelete(childResult.key);
            })
          }
        });
        UserRef.remove();
      } else {
        return null;
      }
    });
  }

  public listLands(): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('users/' + user.uid + '/lands');
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              return snapshot;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error listLands'));
        }
      });
    });

    return promise;
  }

  public landInformation(key: string): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('users/' + user.uid + '/lands/' + key);
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();            
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error landInformation'));
        }
      });
    });

    return promise;
  }


  public createPivot(name: string, location: string[], kind: string, keyLand: string) : Promise<any>{
const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/pivots');
        UserRef.once('value').then(function(snapshot) {
          db.ref('users/' + user.uid + '/pivots').push({
            nombre: [name],
            localizacion: [location],
            tipo: [kind],
            finca: [keyLand],
          });

          resolve('Pivot creada');
        });
      } else {
        reject(Error('Error createLands'));
      }
    });
    });

    return promise;
  }
//https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
  public updatePivot(key: string, name: string, location: string[], kind: string, keyLand: string) {
  
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        db.ref('users/' + user.uid + '/pivots/' + key).update({
          nombre: [name],
          localizacion: [location],
          tipo: [kind],
          finca: [keyLand],
        });
      } else {
        return null;
      }
    });
  }

  public deletePivot(key: string) {
    var devices = this.listDevices.bind(this);
    var deviceDelete = this.deleteDevice.bind(this);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/pivots/' + key);
        devices(key).then((result) =>{
          if(result !== null){
            result.forEach(function(childResult) {       
              deviceDelete(childResult.key);
            })
          }
        });
        UserRef.remove();
      } else {
        return null;
      }
    });
  }

  public listPivots(keyLand: string): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('users/' + user.uid + '/pivots');
          let misDatos;
          var items = [];
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
               snapshot.forEach(function(childResult) {       
                  var finca = childResult.child("finca").val()[0];
                  if(finca === keyLand) items.push(childResult);                    
               })
              return items;              
            }),
          );       
          resolve(misDatos);
        } else {
          reject(Error('Error listPivots'));
        }
      });
    });

    return promise;
  }

  public pivotInformation(key: string): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('users/' + user.uid + '/pivots/' + key);
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error pivotInformation'));
        }
      });
    });

    return promise;
  }


  public createDevice(
    name: string,
    id: string,
    tipo: string,
    location: string[],
    keyLand: string,
    keyPivot: string,
    temperature: string,
    possibleLocation: object[]
  ) : Promise<any>{
  
  
  const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        if(tipo === "GPS"){
          const UserRef = db.ref('users/' + user.uid + '/devices');
          const Ref = db.ref('devices');
          UserRef.once('value').then(function(snapshot) {
          var device = db.ref('users/' + user.uid + '/devices').push({
            nombre: [name],
            id: [id],
            tipo: [tipo],
            localizacion: [location],
            finca: [keyLand],
            pivot: [keyPivot],
            localizacionesPosibles: [possibleLocation],
          });

          db.ref('devices/' + id).push({
            user: [user.uid],
            device: [device.key],
          });
          db.ref('devices/' + id).set({
            user: [user.uid],
            device: [device.key],
          });
          resolve('Dispositivo creado');
        });
        }
        else if(tipo === "Temperatura"){
          const UserRef = db.ref('users/' + user.uid + '/devices');
          UserRef.once('value').then(function(snapshot) {
          var device = db.ref('users/' + user.uid + '/devices').push({
            nombre: [name],
            id: [id],
            tipo: [tipo],
            localizacion: [location],
            temperaturaActual: [temperature],
            finca: [keyLand],
            pivot: [keyPivot],
          });

          db.ref('devices/' + id).push({
            user: [user.uid],
            device: [device.key],
          });
          db.ref('devices/' + id).set({
            user: [user.uid],
            device: [device.key],
          });
          resolve('Dispositivo creado');
        }); 
        }
        } else {
        reject(Error('Error createLands'));
      }

    });
    });

    return promise;
   
  }

  public updateDevice(
    key: string,
    name: string,
    id: string,
    tipo: string,
    location: string[],
    keyLand: string,
    keyPivot: string,
    temperature: string,
    possibleLocation: object[]
  ) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        if(tipo === "GPS"){
        db.ref('users/' + user.uid + '/devices/' + key).update({
          nombre: [name],
          id: [id],
          tipo: [tipo],
          localizacion: [location],
          finca: [keyLand],
          pivot: [keyPivot],
          localizacionesPosibles: [possibleLocation],
        });
        }
        else if(tipo === "Temperatura"){
        db.ref('users/' + user.uid + '/devices/' + key).update({
          nombre: [name],
          id: [id],
          tipo: [tipo],
          localizacion: [location],
          temperaturaActual: [temperature],
          finca: [keyLand],
          pivot: [keyPivot],
        });
        }
      } else {
        return null;
      }
    });
  }

  public deleteDevice(key: string) {
    var alerts = this.listAlerts.bind(this);
    var alertDelete = this.deleteAlert.bind(this);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref(
          'users/' + user.uid + '/devices/' + key
        );
                         
        const deviceRef = firebase.database().ref('users/' + user.uid + '/devices/' + key);
        UserRef.once('value').then(function(snapshot) {
           const obj = snapshot.val();
           var id = obj.id[0];
           const Ref = db.ref('devices/' + id);
           Ref.remove();     
           UserRef.remove();
        });                  
        
        alerts().then((result) =>{
          if(result !== null){
            result.forEach(function(childResult) {   
            if(childResult.child("nombreDispositivo").val()[0] === key)
              alertDelete(childResult.key);
            })
          }
        });
               
      } else {
        return null;
      }
    });
  }

  public listDevices(keyPivot: string): Promise<any> {
   
  const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase
            .database()
            .ref('users/' + user.uid + '/devices');
          let misDatos;
          var items = [];
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {             
                snapshot.forEach(function(childResult) {       
                  var pivot = childResult.child("pivot").val()[0];
                  if(pivot === keyPivot) items.push(childResult);                    
               })
              return items;           
            }),
          );
          resolve(misDatos);
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
          const UserRef = firebase
            .database()
            .ref('users/' + user.uid + '/devices/' + key);
          let misDatos;
          misDatos = Promise.resolve( 
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error deviceInformation'));
        }
      });
    });

    return promise;
  }

  public createAlert(
    name: string,
    tipo: string,
    datos: string[],
    opcion: string,
    keyLand: string,
    keyPivot: string,
    keyDispositivo: string,
    timeAlert: string, timeLastAlert: string, silenced: boolean
  ) : Promise<any>{
const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/alerts');
        UserRef.once('value').then(function(snapshot) {
          var alert = db.ref('users/' + user.uid + '/alerts').push({
            nombre: [name],
            tipo: [tipo],
            nombreTierra: [keyLand],
            nombrePivot: [keyPivot],
            nombreDispositivo: [keyDispositivo],
            opcionAlerta: [opcion],
            datosAlerta: [datos],
            tiempoAlerta: [timeAlert],
            tiempoUltimaAlerta: [timeLastAlert],
            silenciada: [silenced],
          });
          resolve(alert.key);
        });
      } else {
        reject(Error('Error createLands'));
      }
    });
    });

    return promise;
  }

  public updateAlert(
  key: string,
    name: string,
    tipo: string,
    datos: string[],
    opcion: string,
    nameLand: string,
    namePivot: string,
    nameDispositivo: string,
    timeAlert: string, timeLastAlert: string, silenced: boolean
  ) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        if(timeLastAlert === null){
          db.ref('users/' + user.uid + '/alerts/' + key).update({
            nombre: [name],
            tipo: [tipo],
            nombreTierra: [nameLand],
            nombrePivot: [namePivot],
            nombreDispositivo: [nameDispositivo],
            opcionAlerta: [opcion],
            datosAlerta: [datos],
            tiempoAlerta: [timeAlert],
            silenciada: [silenced],
          });
        }
        else{
          db.ref('users/' + user.uid + '/alerts/' + key).update({
            nombre: [name],
            tipo: [tipo],
            nombreTierra: [nameLand],
            nombrePivot: [namePivot],
            nombreDispositivo: [nameDispositivo],
            opcionAlerta: [opcion],
            datosAlerta: [datos],
            tiempoAlerta: [timeAlert],
            tiempoUltimaAlerta: [timeLastAlert],
            silenciada: [silenced],
          });
        }
      } else {
        return null;
      }
    });
  }


  public deleteAlert(key: string) {
    var notifications = this.listNotification.bind(this);
    var notificationDelete = this.deleteNotification.bind(this);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        notifications().then((result) =>{
          if(result !== null){
            result.forEach(function(childResult) {   
            if(childResult.child("alerta").val()[0] === key)
              notificationDelete(childResult.key);
            })
          }
        });
        const UserRef = db.ref('users/' + user.uid + '/alerts/' + key);
        UserRef.remove();
      } else {
        return null;
      }
    });
  }

  public listAlerts(): Promise<any> {
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('users/' + user.uid + '/alerts');
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              return snapshot;
            }),
          );
          resolve(misDatos);
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
          const UserRef = firebase.database().ref('users/' + user.uid + '/alerts/' + key);
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error alerInformation'));
        }
      });
    });
    return promise;
  }
  
  public createNotification(measurement: string, time: string, keyAlert: string): Promise<any>{
   const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/notifications');
        UserRef.once('value').then(function(snapshot) {
          db.ref('users/' + user.uid + '/notifications').push({
            medida: [measurement],
            tiempo: [time],
            alerta: [keyAlert],
          });
          resolve('Notification creada');
        });
      } else {
        reject(Error('Error createNotification'));
      }
    });
    });

    return promise;
  }

  public deleteNotification(key: string){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        const UserRef = db.ref('users/' + user.uid + '/notifications/' + key);
        UserRef.remove();
      } else {
        return null;
      }
    });
  }
  public listNotification(): Promise<any>{
  const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('users/' + user.uid + '/notifications');
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              return snapshot;
            }),
          );
          resolve(misDatos);
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
          const UserRef = firebase.database().ref('users/' + user.uid + '/notifications/' + key);
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error notificationInformation'));
        }
      });
    });
    return promise;
  }
  
  public deviceExist(id: string): Promise<string> {
    const promise = new Promise<string>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('devices');
          UserRef.once('value').then(function(snapshot) {
            if (snapshot.hasChild(id)) {
              const reason = new Error('id en uso');
              reject(reason);
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

  checkDeviceMeasurement(idDevice: string): Promise<any>{
    var items = [];
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('measurements');
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              snapshot.forEach(function(childResult) {       
                  var id = childResult.child("id").val();
                  var location = childResult.child("location").val();
                  var time = childResult.child("time").val();  
                  var key = childResult.key;    
                  var checked = childResult.child("checked").val();         
                  if(id === idDevice && checked === false){
                    if(items.length == 0)
                     items.push({ id: id , location: location, time: time}); 
                     else{
                       if(items[0].time < time){
                       items = [];
                       items.push({ id: id , location: location, time: time}); 
                       }
                     }
                     firebase.database().ref('measurements/'+ key).update({
                        checked: true,
                      });
                  }                 
              });
              return items;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error Measurements'));
        }
      });
    });
    return promise;
  }
  
  checkDeviceId(idDevice: string): Promise<any>{
  const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('devices/'+idDevice);
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              const obj = snapshot.val();
              return obj;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error checkDeviceId'));
        }
      });
    });
    return promise;
  }
  
  public listMeasurements(idDevice: string): Promise<any> {
  var items = [];
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const UserRef = firebase.database().ref('measurements');
          let misDatos;
          misDatos = Promise.resolve(
            UserRef.once('value').then(function(snapshot) {
              snapshot.forEach(function(childResult) {       
                  var id = childResult.child("id").val();                 
                  if(id === idDevice){ 
                     items.push(childResult); 
                  }                 
              });
              return items;
            }),
          );
          resolve(misDatos);
        } else {
          reject(Error('Error listMeasurements'));
        }
      });
    });
    return promise;
  }

  public userAutenticated(): Promise<boolean> {
    const promise = new Promise<boolean>(function(resolve) {
      firebase.auth().onAuthStateChanged(function(user) {
            
        if (user && user.emailVerified) { 
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    return promise;
  }
}
