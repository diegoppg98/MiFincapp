import { IAuthState } from './state';
<<<<<<< HEAD
import {Database} from '../../../interfaceDatabase';
import {ImplementationDatabase} from '../../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();

=======
>>>>>>> origin/master

export interface IAuthGetters {
  isAuthenticated(state: IAuthState): boolean;
}

export const AuthGetters: IAuthGetters = {
  isAuthenticated(state: IAuthState): boolean {
    return state.accessToken !== null;
  },
};
