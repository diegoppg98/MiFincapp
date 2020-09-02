import {Usuario} from '../Clases/Usuario';

export abstract class IUsuarioAPI {
   /**
    * Login a user
    * @param {string} mail - The mail of the user
    * @param {string} pass - The password of the user
    */
   abstract login(mail: string, pass: string): Promise<string>;
   /**
    * Changes the password of a user from the database
    * @param {string} mail - The mail of the user
    * @param {string} pass - The old password of the user
    * @param {string} newPass - The new password of the user
    */
   abstract changePassword(mail: string, pass: string, newPass: string) : Promise<string>;
   /**
    * Changes and sends to the mail of the user a new password
    * @param {string} mail - The mail of the user
    */
   abstract forgetPassword(mail: string): Promise<string>;
   /**
    * Closes the session of the user who is authenticated
    */
   abstract logout() : Promise<string>;
   /**
    * Gets the database user icon that is authenticated
    */
   abstract userProfileIcon(): Promise<string>;
   /**
    * Creates a new user in the database
    * @param {Usuario} object
    */
   abstract createUser(usuario: Usuario, pass: string): Promise<string>;
   /**
    * Updates a user from the database
    * @param {Usuario} object
    */
   abstract updateUser(usuario : Usuario): Promise<string>;
   /**
    * Updates a user image from the database
    * @param {Usuario} object
    */
   abstract updateUserImage(usuario : Usuario): Promise<string>;
   /**
    * Deletes a user from the database
    * @param {string} key - The key of the user to delete
    */
   abstract deleteUser() : Promise<string>;
   /**
    * Gets the database user that is authenticated
    */
   abstract userInformation(): Promise<object>;
   /**
    * Checks if user is authenticated
    */
   abstract userAutenticated(): Promise<boolean>;
}
