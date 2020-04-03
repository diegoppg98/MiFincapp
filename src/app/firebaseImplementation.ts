import {Database} from './interfaceDatabase';
import firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyDvNNc2-XaHTnZDDy6g_uTEciVqc3z8nfc",
    authDomain: "pivot-2f31f.firebaseapp.com",
    databaseURL: "https://pivot-2f31f.firebaseio.com",
    projectId: "pivot-2f31f",
    storageBucket: "pivot-2f31f.appspot.com",
    messagingSenderId: "919977317494",
    appId: "1:919977317494:web:ea08bb9e69e0ba7303bb57"
  };



export class ImplementationDatabase implements Database {

    init(){
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
    }    

    login(mail:string, pass:string){
      var promise = new Promise(function(resolve, reject) {
        firebase.auth().signInWithEmailAndPassword(mail,pass).then((user) =>{resolve("Usuario iniciado correctamente")}, (error) => reject(Error(error)));
     });
     return promise;
    }

    logout() {
       firebase.auth().onAuthStateChanged(function(user) {
         firebase.auth().signOut().then(() =>console.log('Usuario desconectado'));
       });  
    }
	
    createUser(mail:string, pass:string , name:string, picture:string, address:string, phone:string){
          var db = firebase.database();
          var promise = new Promise(function(resolve, reject) {
            firebase.auth().createUserWithEmailAndPassword(mail, pass).then((result) => {
              firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  db.ref('users/' + user.uid).push({
                    correo: [mail],
                    nombre: [name],
                    foto: [picture],
                    direccion: [address],
                    telefono: [phone]
                  });
                  db.ref('users/' + user.uid).set({
                    correo: [mail],
                    nombre: [name],
                    foto: [picture],
                    direccion: [address],
                    telefono: [phone]
                  });
                }
              }); 
              resolve("Usuario creado correctamente")
            },(error) => reject(Error(error)));
          });
          return promise;     
    }

    updateUser(mail:string, pass:string , name:string, picture:string, address:string, phone:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();          
          db.ref('users/' + user.uid).update({
             correo: [mail],
             nombre: [name],
             foto: [picture],
             direccion: [address],
             telefono: [phone]
          });
        } else {
          return null;
        }
      }); 
    }

    deleteUser(){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid);	
          UserRef.remove();
          user.delete().then(function() {
            // User deleted.
          }).catch(function(error) {
            // An error happened.
          });
        } else {
          return null;
        }
      }); 
    }

    userInformation():Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var name;
                 var UserRef = firebase.database().ref('users/' + user.uid);
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
			   const obj2 = Object.values(obj);
			   name = obj.nombre[0];
                          // console.log(obj);
			   return obj;
		       })
                 )
               resolve(misDatos)
               } else { 
                 reject(Error('Error userInformation'))
               }
            })       
      });
      return promise;
    }

    createLand(name:string, description:string , location:string[], size:string, crop:string){ 
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/lands');	
          UserRef.once('value').then(function(snapshot){ 
            db.ref('users/' + user.uid + '/lands/' + name).push({
              nombre: [name],
	      descripcion: [description],
	      localizacion: [location],
	      tamaño: [size],
	      cultivo: [crop]
	     });
            db.ref('users/' + user.uid+ '/lands/' + name).set({
	      nombre: [name],
	      descripcion: [description],
	      localizacion: [location],
	      tamaño: [size],
	      cultivo: [crop]
	    });                           
          })
        } else {
          return null;
        }
      });    
    }

    updateLand(name:string, description:string , location:string[], size:string, crop:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          db.ref('users/' + user.uid + '/lands/' + name).update({
            nombre: [name],
            descripcion: [description],
            localizacion: [location],
            tamaño: [size],
            cultivo: [crop]
          });
        } else {
          return null;
        }
      }); 
    }

    deleteLand(name:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/lands/' +name);	
          UserRef.remove();
        } else {
          return null;
        }
      }); 
    }

    listLands():Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var name;
                 var UserRef = firebase.database().ref('users/' + user.uid + '/lands');
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
                           if(obj === null) return null;
                           else{
			     const obj2 = Object.values(obj);			   
			     return obj2;
                           }
		       })
                 )
               resolve(misDatos)
               } else {
                 reject(Error('Error listLands'))
               }
            })       
      });

    return promise; 
    }

    landInformation(name:string):Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var UserRef = firebase.database().ref('users/' + user.uid + '/lands/' + name);
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
			  // const obj2 = Object.values(obj);			   
                         //  console.log(obj); console.log(snapshot);
                          // console.log(obj2[0].nombre[0]);
			   return obj;
		       })
                 )
               resolve(misDatos)
               } else { 
                 reject(Error('Error landInformation'))
               }
            })       
      });

    return promise; 
    }

    landExist(name:string):Promise<string>{      
      var promise = new Promise<string>(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
           if(user){
        var UserRef =  firebase.database().ref('users/' + user.uid + '/lands');	
        UserRef.once('value').then(function(snapshot){ 
	  if (snapshot.hasChild(name)) {
            var reason = new Error('nombre en uso');
            reject(reason);
   	  }
          else {
            resolve('nombre libre');
          } 
       })
      }else { 
          reject(Error('Error alertExist'))
        }
      }) 
    });
    return promise;
    }

    createPivot(name:string, description:string , location:string[], kind:string, nameLand:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/lands/'+ nameLand);	
          UserRef.once('value').then(function(snapshot){ 
            db.ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + name).push({
               nombre: [name],
               descripcion: [description],
               localizacion: [location],
               tipo: [kind]
	     });
            db.ref('users/' + user.uid+ '/lands/'+ nameLand + '/pivots/' + name).set({
              nombre: [name],
              descripcion: [description],
              localizacion: [location],
              tipo: [kind]
	    });                           
          })
        } else {
          return null;
        }
      });        
    } 

    updatePivot(name:string, description:string , location:string[], kind:string, nameLand:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          db.ref('users/' + user.uid+ '/lands/'+ nameLand + '/pivots/' + name).update({
              nombre: [name],
              descripcion: [description],
              localizacion: [location],
              tipo: [kind]
          });
        } else {
          return null;
        }
      }); 
    } 

    deletePivot(name:string, nameLand:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + name);	
          UserRef.remove();
        } else {
          return null;
        }
      }); 
    }

    listPivots(nameLand:string):Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var name;
                 var UserRef = firebase.database().ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots');
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();  
                           if(obj === null) return null;
                           else{
			      const obj2 = Object.values(obj);			   
			      return obj2;
                           }
		       })
                 )
               resolve(misDatos)
               } else { console.log(nameLand);
                 reject(Error('Error listPivots'))
               }
            })       
      });

    return promise; 
    }

    pivotInformation(nameLand:string, name:string):Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
              
                 var UserRef = firebase.database().ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + name);
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
			  // const obj2 = Object.values(obj);			   
                         //  console.log(obj); console.log(snapshot);
                          // console.log(obj2[0].nombre[0]);
			   return obj;
		       })
                 )
               resolve(misDatos)
               } else { 
                 reject(Error('Error pivotInformation'))
               }
            })       
      });

    return promise; 
    }

    pivotExist(nameLand:string, name:string):Promise<string>{      
      var promise = new Promise<string>(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
           if(user){
        var UserRef =  firebase.database().ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots');	
        UserRef.once('value').then(function(snapshot){ 
	  if (snapshot.hasChild(name)) {
            var reason = new Error('nombre en uso');
            reject(reason);
   	  }
          else {
            resolve('nombre libre');
          } 
       })
      }else { 
          reject(Error('Error pivotExist'))
        }
      }) 
    });
    return promise;
    }

    createDevice(name:string, tipo:string, description:string , location:string[], nameLand:string, namePivot:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + namePivot);	
          UserRef.once('value').then(function(snapshot){ 
            db.ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + namePivot + '/devices/' + name).push({
              nombre: [name],
              tipo: [tipo],
              descripcion: [description],
              localizacion: [location]
	     });
            db.ref('users/' + user.uid+ '/lands/'+ nameLand + '/pivots/' + namePivot + '/devices/' + name).set({
              nombre: [name],
              tipo: [tipo],
              descripcion: [description],
              localizacion: [location]
	    });                           
          })
        } else {
          return null;
        }
      });
    }

    updateDevice(name:string, tipo:string, description:string , location:string[], nameLand:string, namePivot:string){
      firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
          var db = firebase.database();
          db.ref('users/' + user.uid+ '/lands/'+ nameLand + '/pivots/' + namePivot + '/devices/' + name).update({
              nombre: [name],
              tipo: [tipo],
              descripcion: [description],
              localizacion: [location]
          });
        } else {
          return null;
        }
      }); 
    }

    deleteDevice(name:string, nameLand:string, namePivot:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + namePivot + '/devices/' + name);	
          UserRef.remove();
        } else {
          return null;
        }
      }); 
    }

    listDevices(nameLand:string, namePivot:string):Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var name;
                 var UserRef = firebase.database().ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + namePivot +'/devices');
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
                           if(obj === null) return null;
                           else{
			     const obj2 = Object.values(obj);			   
			     return obj2;
                           }
		       })
                 )
               resolve(misDatos)
               } else {
                 reject(Error('Error listDevices'))
               }
            })       
      });

    return promise; 
    }

    deviceInformation(nameLand:string, namePivot:string, name:string):Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
              
                 var UserRef = firebase.database().ref('users/' + user.uid+ '/lands/'+ nameLand + '/pivots/' + namePivot + '/devices/' + name);
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
			  // const obj2 = Object.values(obj);			   
                          // console.log(obj2[0].nombre[0]);
			   return obj;
		       })
                 )
               resolve(misDatos)
               } else { 
                 reject(Error('Error deviceInformation'))
               }
            })       
      });

    return promise; 
    }

    deviceExist(nameLand:string, namePivot:string, name:string):Promise<string>{      
      var promise = new Promise<string>(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
           if(user){
        var UserRef =  firebase.database().ref('users/' + user.uid + '/lands/'+ nameLand + '/pivots/' + namePivot +'/devices');	
        UserRef.once('value').then(function(snapshot){ 
	  if (snapshot.hasChild(name)) {
            var reason = new Error('nombre en uso');
            reject(reason);
   	  }
          else {
            resolve('nombre libre');
          } 
       })
      }else { 
          reject(Error('Error deviceExist'))
        }
      }) 
    });
    return promise;
    }

    createAlert(name:string, tipo:string, description:string , datos:string[], opcion:string, nameLand:string, namePivot:string, nameDispositivo:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/alerts/'+ name);	
          UserRef.once('value').then(function(snapshot){ 
            db.ref('users/' + user.uid + '/alerts/'+ name).push({
              nombre: [name],
              tipo: [tipo],
              descripcion: [description],
              nombreTierra: [nameLand],
              nombrePivot: [namePivot],
              nombreDispositivo: [nameDispositivo],
              opcionAlerta: [opcion],
              datosAlerta: [datos]
	     });
            db.ref('users/' + user.uid + '/alerts/'+ name).set({
              nombre: [name],
              tipo: [tipo],
              descripcion: [description],
              nombreTierra: [nameLand],
              nombrePivot: [namePivot],
              nombreDispositivo: [nameDispositivo],
              opcionAlerta: [opcion],
              datosAlerta: [datos]
	    });                           
          })
        } else {
          return null;
        }
      });
    }

    updateAlert(name:string, tipo:string, description:string , datos:string[], opcion:string, nameLand:string, namePivot:string, nameDispositivo:string){
      firebase.auth().onAuthStateChanged(function(user) {     
        if (user) {
          var db = firebase.database();
            db.ref('users/' + user.uid + '/alerts/'+ name).update({
              nombre: [name],
              tipo: [tipo],
              descripcion: [description],
              nombreTierra: [nameLand],
              nombrePivot: [namePivot],
              nombreDispositivo: [nameDispositivo],
              opcionAlerta: [opcion],
              datosAlerta: [datos]
	    });
        } else {
          return null;
        }
      }); 
    }

    deleteAlert(name:string){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.database();
          var UserRef =  db.ref('users/' + user.uid + '/alerts/'+ name);	
          UserRef.remove();
        } else {
          return null;
        }
      }); 
    }

    listAlerts():Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var name;
                 var UserRef = firebase.database().ref('users/' + user.uid + '/alerts');
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
                           if(obj === null) return null;
                           else{
			     const obj2 = Object.values(obj);			   
			     return obj2;
                           }
		       })
                 )
               resolve(misDatos)
               } else {
                 reject(Error('Error listAlerts'))
               }
            })       
      });
    return promise; 
    }

    alertInformation(name:string):Promise<any>{
      var promise = new Promise(function(resolve, reject) {
            firebase.auth().onAuthStateChanged(function(user) {
               if(user){  
                 var UserRef = firebase.database().ref('users/' + user.uid + '/alerts/'+ name);
	         var misDatos;
                 misDatos = Promise.resolve(
		       UserRef.once('value').then(function(snapshot){ 
			   const obj = snapshot.val();
			   return obj;
		       })
                 )
               resolve(misDatos)
               } else { 
                 reject(Error('Error alerInformation'))
               }
            })       
      });
    return promise; 
    }

    alertExist(name:string):Promise<string>{      
      var promise = new Promise<string>(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
       if(user){
        var UserRef =  firebase.database().ref('users/' + user.uid + '/alerts');	
        UserRef.once('value').then(function(snapshot){ 
	  if (snapshot.hasChild(name)) {
            var reason = new Error('nombre en uso');
            reject(reason);
   	  }
          else {
            resolve('nombre libre');
          } 
       })
      }else { 
          reject(Error('Error landExist'))
        }
      }) 
    });
    return promise;
    }


    userAutenticated():Promise<boolean>{
      var promise = new Promise<boolean>(function (resolve) {
        firebase.auth().onAuthStateChanged(function(user) {
           if(user){
            resolve(true);
        }else { 
            resolve(false);
        }
      }) 
    });
    return promise;
    }
}





