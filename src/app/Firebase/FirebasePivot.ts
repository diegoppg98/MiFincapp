import firebase from 'firebase';
import {PivotInterface} from '../Interfaces/PivotInterface';
import {Pivot} from '../Clases/Pivot'; 
import {FirebaseDispositivo} from '../Firebase/FirebaseDispositivo';
let FunctionsDispositivo: FirebaseDispositivo = new FirebaseDispositivo();

  let pivotConverter = {
      toFirestore: function(pivot) {
          return {              
              nombre: pivot.nombre,
              localizacion: pivot.localizacion,
              tipo: pivot.tipo,
              finca: pivot.finca,
          }
      }, 
      fromFirestore: function(snapshot, options){
          const data = snapshot.data(options);
          return new Pivot(snapshot.id,data.nombre, data.tipo, data.localizacion, data.finca)
      }
  }
  
 export class FirebasePivot implements PivotInterface{
 
  public createPivot(pivot : Pivot) : Promise<any>{
   const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/pivots').withConverter(pivotConverter).add(pivot)
        .then(function(docRef) {
          resolve('Pivot creado');
        })
        .catch(function(error) {
          reject(Error('Error createPivot'));
        });
      } else {
        reject(Error('Error createPivot'));
      }
    });
   });
   return promise;
  }

  public updatePivot(pivot : Pivot) : Promise<any> {
  const promise = new Promise(function(resolve, reject) {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        firebase.firestore().collection('users/' + user.uid + '/pivots/').doc(pivot.key).withConverter(pivotConverter).set(pivot)
         .then(function(docRef) {
           resolve('Pivot actualizado');
         })
         .catch(function(error) {
           reject(Error('Error updatePivot'));
         });
       } else {
         reject(Error('Error updatePivot'));
       }
     });
    });
    return promise;
  }

  public deletePivot(keyPivot: string) : Promise<any> {
    const promise = new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/pivots').doc(keyPivot).delete()
         .then(function(docRef) {
           resolve('Pivot eliminada');
         })
         .catch(function(error) {
           reject(Error('Error deletePivot'));
         });         
         FunctionsDispositivo.listDevices(keyPivot).then((result) =>{
           if(result !== null){
             result.forEach(function(childResult) {       
               FunctionsDispositivo.deleteDevice(childResult);
             })
           }
         });
      } else {
        reject(Error('Error deletePivot'));
      }
    });
    });
    return promise;
  }

  public listPivots(keyLand: string): Promise<any> { 
   const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
          let pivotsRef =  firebase.firestore().collection('users/' + user.uid + '/pivots').withConverter(pivotConverter);
          pivotsRef.get()
          .then(snapshot => {
            var pivots = [];
            snapshot.forEach(doc => {
              if(doc.data().finca === keyLand)
                pivots.push(doc.data());
            });
           resolve(pivots);
          })
          .catch(err => {
            reject(Error('Error listPivots'));
          });         
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
        let pivotRef = firebase.firestore().collection('users/' + user.uid + '/pivots').doc(key).withConverter(pivotConverter);
          pivotRef.get()
          .then(doc => {
            if (!doc.exists) {
              reject(Error('Error pivotInformation'));
            } else {
              resolve(doc.data());
            }
          })
          .catch(err => {
            reject(Error('Error pivotInformation'));
          });
        } else {
          reject(Error('Error pivotInformation'));
        }
      });
    });

    return promise;
  }
}

