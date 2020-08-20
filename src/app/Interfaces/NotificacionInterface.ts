import {Notificacion} from '../Clases/Notificacion';

export interface NotificacionInterface {
   createNotification(notification: Notification): Promise<any>;
   deleteNotification(key: string): Promise<any>;
   listNotification(): Promise<any>;
   notificationInformation(key: string): Promise<any>;
}
