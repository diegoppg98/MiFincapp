import {Notificacion} from '../Clases/Notificacion';

export abstract class INotificacionAPI {
   /**
    * Creates a new notification in the database
    * @param {Notification} object
    */
   abstract createNotification(notification: Notification): Promise<string>;
   /**
   * Deletes a notification from the database
   * @param {string} key - The key of the notification to delete
   */
   abstract deleteNotification(key: string): Promise<string>;
   /**
    * Gets a lists of all notifications from the database that belong to a user
    */
   abstract listNotification(): Promise<object[]>;
   /**
   * Gets one notification from the database
   * @param {string} key - The key of the notification
   */
   abstract notificationInformation(key: string): Promise<object>;
}
