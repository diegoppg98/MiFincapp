import firebase from 'firebase';
import {MedidaInterface} from '../Interfaces/MedidaInterface';
import {Medida} from '../Clases/Medida';

 let medidaConverter = {
      toFirestore: function(medida) {
          return {              
              id: medida.id,
              medida: medida.medida,
              chequeada: medida.chequeada,
              notificada: medida.notificada,
              tiempo: medida.tiempo
          }
      }, 
      fromFirestore: function(snapshot, options){
          const data = snapshot.data(options);
          return new Medida(snapshot.id, data.id, data.medida, data.chequeada, data.notificada, data.tiempo)
      }
  }
  
  export class FirebaseMedida implements MedidaInterface{
  
  public createMeasurement(medida: Medida) : Promise<any>{
   const promise = new Promise(function(resolve, reject) {
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
  
public listMeasurements(idDevice: string, limit:number): Promise<any> {
  var items = [];
  var number = 0;
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        //.orderBy('tiempo', 'desc')
        let measurementsRef =  firebase.firestore().collection('measurements').where('id', '==', idDevice);//.orderBy('tiempo', 'desc').withConverter(medidaConverter);//.where('id', '==', idDevice).limit(limit)
          measurementsRef.get()
          .then(snapshot => {
            var medidas = [];
            snapshot.forEach(doc => {
                    /*    if(t.tipo === 'GPS'){
               var p;                                 
               var puntoDevice = L.latLng(doc.data().medida[0],doc.data().medida[1]);
    if(t.tipoPivot === "lineal"){
      p = FunctionsUtils.pivotPosition(t.tipoPivot, t.positions, puntoDevice);  
    }
    else{
      p = FunctionsUtils.pivotPosition(t.tipoPivot, t.positions, puntoDevice);      
    }                                                    
    } */
  
           //   if(doc.data().id == idDevice && number < limit){
            //  if(number < limit){
              //  number = number +1;
                medidas.push(doc.data());
              //}
            });
            var deleteItems = medidas.length - limit;
            medidas.sort(function(a, b){
             if(a.tiempo > b.tiempo) { return -1; }
             if(a.tiempo < b.tiempo) { return 1; }
             return 0;
            })
            if(deleteItems > 0)
              medidas.splice(limit, deleteItems);
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
  
  checkDeviceMeasurement(idDevice: string): Promise<any>{
    var items = [];
    const promise = new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {  
        //checkeableMeasurement      
        let measurementRef =  firebase.firestore().collection('measurements').where('id', '==', idDevice).where('chequeada', '==', false).withConverter(medidaConverter);
          measurementRef.get()
          .then(snapshot => {         
            var medida = [];           
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
              /*
              firebase.firestore().collection('checkeableMeasurement').doc(doc.data().key).delete()
         .then(function(docRef) {
           
         })
         .catch(function(error) {
           reject(Error('Error checkDeviceMeasurement'));
         });
              
              firebase.firestore().collection('/measurements').withConverter(medidaConverter).add(medidaActualizada)
        .then(function(docRef) {          
        })
        .catch(function(error) {
          reject(Error('Error checkDeviceMeasurement'));
        });
        */
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
