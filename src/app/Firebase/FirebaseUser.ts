import firebase from 'firebase';
import {IUsuarioAPI} from '../Interfaces/IUsuarioAPI';
import {Usuario} from '../Clases/Usuario';


 let usuarioConverter = {
      toFirestore: function(usuario : any) {
          return {
              correo: usuario.correo,
              nombre: usuario.nombre,
              direccion: usuario.direccion,
              foto: usuario.foto
              }
      },
      fromFirestore: function(snapshot: { data: (arg0: any) => any; id: string; }, options: any){
          const data = snapshot.data(options);
        
          return new Usuario(snapshot.id,data.correo, data.nombre, data.direccion, data.foto)
      }
  }

export class FirebaseUser extends IUsuarioAPI{

  public login(mail: string, pass: string): Promise<string> {
    const promise = new Promise<string>(function(resolve, reject) {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then(
          (user) => {
            const userMail = firebase.auth().currentUser;
           if(!userMail.emailVerified)
             reject('Correo no verificado, por favor revise su correo y confirme su cuenta');
           else
            resolve('Usuario iniciado');
          },
          (error) => reject('Datos incorrectos'),
        );
    });
    return promise;
  }


  public changePassword(name: string, pass: string, newPass: string) : Promise<string>{
    const promise = new Promise<string>(function(resolve, reject) {
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

  public forgetPassword(name: string): Promise<string>{
    const promise = new Promise<string>(function(resolve, reject) {
        firebase.auth().languageCode = 'es';
        firebase.auth().sendPasswordResetEmail(name).then(() => {
            resolve('Contraseña enviada al correo');
        }).catch((error) => { 
            reject(Error('Datos incorrectos'));
        });
    });
    return promise;
  }


  public logout() : Promise<string>{
    const promise = new Promise<string>(function(resolve, reject) {
     firebase.auth().signOut().then(function() {
        resolve('Usuario desconectado correctamente');
     }).catch(function(error) {
       reject(Error('Usuario en logout'));
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
  

  public createUser(usuario: Usuario, pass: string): Promise<string> {
    const promise = new Promise<string>(function(resolve, reject) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(usuario.correo, pass)
        .then(
          (result) => {
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                var foto = '';
                if (usuario.foto){
                   const ref = firebase.storage().ref('userPicture');
                   const task = ref.child(usuario.correo).put(usuario.foto);
                   var pictureRef = ref.child(usuario.correo);
                   pictureRef.getDownloadURL().then(function(url) {
                     usuario.foto = url;
                     firebase.firestore().collection('users/').doc(user.uid).withConverter(usuarioConverter).set(usuario)
                     .then(function(docRef) {
                      })
                      .catch(function(error) {
                      });  
                   });
                }
                else{
                  firebase.firestore().collection('users/').doc(user.uid).withConverter(usuarioConverter).set(usuario)
                  .then(function(docRef) {
                   })
                  .catch(function(error) {
                  });  
                }
                firebase.auth().languageCode = 'es';
                user.sendEmailVerification().catch(function(error) {
                  reject(Error(error));
                });                
              }
            });
            resolve('Usuario creado correctamente');
            
          },
          (error) => reject(Error(error)),
        );
    });
    return promise;
  }

  public updateUser(usuario : Usuario): Promise<string> {
const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.firestore().collection('users/').doc(user.uid).withConverter(usuarioConverter).set(usuario)
        .then(function(docRef) {
           resolve('usuario actualizada');
        })
        .catch(function(error) {
           reject(Error('Error updateUser'));
        });
      resolve('Actualizado');
      } else {
        reject(Error('Error updateUser'));
      }
    });
   });
return promise;
  }
  
  public updateUserImage(usuario : Usuario): Promise<string> {
const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var foto = '';
          const ref = firebase.storage().ref('userPicture');
          const task = ref.child(usuario.correo).put(usuario.foto);
          var pictureRef = ref.child(usuario.correo);
          pictureRef.getDownloadURL().then(function(url) {
             usuario.foto = url;
             firebase.firestore().collection('users/').doc(user.uid).withConverter(usuarioConverter).set(usuario)
             .then(function(docRef) {
               resolve(url);
             })
             .catch(function(error) {
               reject(Error('Error updateUser'));
             });
          });
      } else {
        reject(Error('Error updateUser'));
      }
    });
   });
return promise;
  }

  public deleteUser() : Promise<string> {
  const promise = new Promise<string>(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {     
       firebase.firestore().collection('users/').doc(user.uid).delete()
       .then(function(docRef) { 
         user.delete().then(function() {  
           resolve('user eliminado');
         })
         .catch(function(error) {
           reject(Error('Error deleteUser'));
         });  
       }).catch(function(error) {
           reject(Error('Error deleteUser'));
       });            
      } else {
        reject(Error('Error deleteUser'));
      }
     });
    });
    return promise;
  }

  public userInformation(): Promise<object> {
    const promise = new Promise<object>(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {       
        let userRef = firebase.firestore().collection('users').doc(user.uid).withConverter(usuarioConverter);
          userRef.get()
          .then(doc => {       
            if (!doc.exists) {
              reject(Error('Error userInformation'));
            } else {
              resolve(doc.data());
            }
          })
          .catch(err => {
            reject(Error('Error userInformation'));
          });           
        } else {
          reject(Error('Error userInformation'));
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
