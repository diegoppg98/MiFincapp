import {Usuario} from '../Clases/Usuario';

export interface UsuarioInterface {
   login(mail: string, pass: string): Promise<any>;
   changePassword(mail: string, pass: string, newPass: string) : Promise<any>;
   forgetPassword(mail: string): Promise<any>;
   logout() : Promise<any>;
   userProfileIcon(): Promise<string>;
   appIcon(): Promise<string>;
   createUser(usuario: Usuario, pass: string): Promise<any>;
   updateUser(usuario : Usuario): Promise<any>;
   deleteUser() : Promise<any>;
   userInformation(): Promise<any>;
   userAutenticated(): Promise<boolean>;
}
