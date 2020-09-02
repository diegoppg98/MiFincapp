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
