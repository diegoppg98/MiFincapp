import firebase from 'firebase';
import {IMedidaAPI} from '../Interfaces/IMedidaAPI';
import {Medida} from '../Clases/Medida';

 let medidaConverter = {
      toFirestore: function(medida : any) {
          return {              
              id: medida.id,
              medida: medida.medida,
              chequeada: medida.chequeada,
              notificada: medida.notificada,
              tiempo: medida.tiempo
          }
      }, 
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
          return new Medida(snapshot.id, data.id, data.medida, data.chequeada, data.notificada, data.tiempo)
      }
  }
  
  export class FirebaseMedida extends IMedidaAPI{
  
  public createMeasurement(medida: Medida) : Promise<string>{
   const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('/measurements').withConverter(medidaConverter).add(medida)
        .then(function(docRef) {
          resolve('Medida creada');
        })
        .catch(function(error) {
          reject(Error('Error createMeasurement'));
        });        
      } else {
        reject(Error('Error createMeasurement'));
      }  
    });
   });
   return promise;
  }
  
public listMeasurements(idDevice: string, limit:number): Promise<object[]> {
  var items = [];
  var number = 0;
    const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        let measurementsRef =  firebase.firestore().collection('measurements/'+idDevice+'/idMeasurements').withConverter(medidaConverter).orderBy('tiempo', 'desc').limit(limit);
          measurementsRef.get()
          .then(snapshot => {
            var medidas : Medida[] = [];
            snapshot.forEach(doc => {
                medidas.push(doc.data());
            });
           resolve(medidas);
          })
          .catch(err => {
            reject(Error('Error listMeasurements'));
          });
        } else {
          reject(Error('Error listMeasurements'));
        }
      });
    });
    return promise;
  }
  
  checkDeviceMeasurement(idDevice: string): Promise<object[]>{
    var items = [];
    const promise = new Promise<object[]>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {       
        let measurementRef =  firebase.firestore().collection('measurements').where('id', '==', idDevice).where('chequeada', '==', false).withConverter(medidaConverter);
          measurementRef.get()
          .then(snapshot => {         
            var medida : Medida[] = [];       
            snapshot.forEach(doc => {        
              if(medida.length == 0)
                 medida.push(doc.data()); 
              else{
                  if(medida[0].tiempo < doc.data().tiempo){
                     medida = [];
                     medida.push(doc.data()); 
                   }
              }
              var medidaActualizada = new Medida(doc.data().key, doc.data().id, doc.data().medida, true, doc.data().notificada, doc.data().tiempo);
 firebase.firestore().collection('measurements').doc(medidaActualizada.key).withConverter(medidaConverter).set(medidaActualizada)
         .then(function(docRef) {           
         })
         .catch(function(error) {
           reject(Error('Error checkDeviceMeasurement'));
         });         
        });
           resolve(medida);          
          })
          .catch(err => {
            reject(Error('Error checkDeviceMeasurement'));
          });     
        } else {
          reject(Error('Error checkDeviceMeasurement'));
        }
      });
    });
    return promise;
  }
}
