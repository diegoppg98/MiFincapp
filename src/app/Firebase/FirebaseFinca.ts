import firebase from 'firebase';
import {Finca} from '../Clases/Finca';
import {IFincaAPI} from '../Interfaces/IFincaAPI';
import {FirebasePivot} from '../Firebase/FirebasePivot';
import { Pivot } from '../Clases/Pivot';
let FunctionsPivot: FirebasePivot = new FirebasePivot();

 let fincaConverter = {
      toFirestore: function(finca : any) {
          return {
              nombre: finca.nombre,
              localizacion: finca.localizacion,
              tamaño: finca.tamaño,
              cultivo: finca.cultivo
              }
      },
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
          return new Finca(snapshot.id,data.nombre, data.tamaño, data.cultivo, data.localizacion)
      }
  }
  
 export class FirebaseFinca extends IFincaAPI{
 
  public createLand(finca: Finca) : Promise<string>{
   const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/' + user.uid + '/lands').withConverter(fincaConverter).add(finca)
        .then(function(docRef) {
          resolve('Tierra creada');
        })
        .catch(function(error) {
          reject(Error('Error createLands'));
        });        
      } else {
        reject(Error('Error createLands'));
      }  
    });
   });
   return promise;
  }

  public updateLand(finca: Finca) : Promise<string> {
   const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.database();
        firebase.firestore().collection('users/'+ user.uid + '/lands/').doc(finca.key).withConverter(fincaConverter).set(finca)
         .then(function(docRef) {
           resolve('Tierra actualizada');
         })
         .catch(function(error) {
           reject(Error('Error updateLand'));
         });
       } else {
         reject(Error('Error updateLand'));
       }
     });
    });
    return promise;
  }

  public deleteLand(keyLand: string) : Promise<string> {
    const promise = new Promise<string>(function(resolve, reject) {
     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        firebase.firestore().collection('users/' + user.uid + '/lands').doc(keyLand).delete()
         .then(function(docRef) {
           resolve('Tierra eliminada');
         })
         .catch(function(error) {
           reject(Error('Error deleteLand'));
         });

         FunctionsPivot.listPivots(keyLand).then((result) =>{
           if(result !== null){
             result.forEach(function(childResult : Pivot) {       
               FunctionsPivot.deletePivot(childResult.key);
             })
           }
         });

      } else {
        reject(Error('Error deleteLand'));
      }
     });
    });
    return promise;
  }

  public listLands(): Promise<object[]> {
    const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
          let landsRef =  firebase.firestore().collection('users/' + user.uid + '/lands').withConverter(fincaConverter);
          landsRef.get()
          .then(snapshot => {
            var fincas : Finca[] = [];    
            snapshot.forEach(doc => {
              fincas.push(doc.data());
            });
           resolve(fincas);
          })
          .catch(err => {
            reject(Error('Error listLands'));
          });         
        } else {
          reject(Error('Error listLands'));
        }
      }); 
    });

    return promise;
  }

  public landInformation(key: string): Promise<object> {
    const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let landRef = firebase.firestore().collection('users/' + user.uid + '/lands').doc(key).withConverter(fincaConverter);
          landRef.get()
          .then(doc => {
            if (!doc.exists) {
              reject(Error('Error landInformation'));
            } else {
              resolve(doc.data());
            }
          })
          .catch(err => {
            reject(Error('Error landInformation'));
          });               
        } else {
          reject(Error('Error landInformation'));
        }
      });
    });

    return promise;
  }
}
