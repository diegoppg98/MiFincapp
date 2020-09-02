import firebase from 'firebase';
import {IPivotAPI} from '../Interfaces/IPivotAPI';
import {Pivot} from '../Clases/Pivot'; 
import {FirebaseDispositivo} from '../Firebase/FirebaseDispositivo';
import { Dispositivo } from '../Clases/Dispositivo';
let FunctionsDispositivo: FirebaseDispositivo = new FirebaseDispositivo();

  let pivotConverter = {
      toFirestore: function(pivot : any) {
          return {              
              nombre: pivot.nombre,
              localizacion: pivot.localizacion,
              tipo: pivot.tipo,
              finca: pivot.finca,
              posActual: pivot.posActual,
          }
      }, 
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
          return new Pivot(snapshot.id,data.nombre, data.tipo, data.localizacion, data.finca,data.posActual)
      }
  }
  
 export class FirebasePivot extends IPivotAPI{
 
  public createPivot(pivot : Pivot) : Promise<string>{
   const promise = new Promise<string>(function(resolve, reject) {
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

  public updatePivot(pivot : Pivot) : Promise<string> {
  const promise = new Promise<string>(function(resolve, reject) {
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

  public deletePivot(keyPivot: string) : Promise<string> {
    const promise = new Promise<string>(function(resolve, reject) {
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
             result.forEach(function(childResult : Dispositivo) {       
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

  public listPivots(keyLand: string): Promise<object[]> { 
   const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
          let pivotsRef =  firebase.firestore().collection('users/' + user.uid + '/pivots').withConverter(pivotConverter);
          pivotsRef.get()
          .then(snapshot => {
            var pivots : Pivot[] = [];
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

  public pivotInformation(key: string): Promise<object> {
    const promise = new Promise<object>(function(resolve, reject) {
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

