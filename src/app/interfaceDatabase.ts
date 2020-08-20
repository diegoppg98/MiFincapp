export interface Database {
  init();
  login(name: string, pass: string);
  changePassword(name: string, pass: string, newPass: string);
  forgetPassword(name: string);
  logout();
  userInformation(): Promise<any>;
  createUser(mail: string, pass: string, name: string, picture: object, address: string);
  updateUser(mail: string, pass: string, name: string, picture: object, address: string): Promise<any>;
  deleteUser();
  createLand(name: string, location: string[], size: string, crop: string): Promise<any>;
  updateLand(key: string, name: string, location: string[], size: string, crop: string);
  deleteLand(key: string);
  listLands(): Promise<any>;
  landInformation(key: string): Promise<any>;
  createPivot(name: string, location: string[], kind: string, keyLand: string): Promise<any>;
  updatePivot(key: string, name: string, location: string[], kind: string, keyLand: string);
  deletePivot(key: string);
  listPivots(keyLand: string): Promise<any>;
  pivotInformation(key: string): Promise<any>;
  createDevice(name: string, id: string, tipo: string, location: string[], keyLand: string, keyPivot: string, temperature: string, possibleLocation: object[]): Promise<any>;
  updateDevice(key: string, name: string, id: string, tipo: string, location: string[], keyLand: string, keyPivot: string, temperature: string, possibleLocation: object[]);
  listDevices(keyPivot: string): Promise<any>;
  deviceInformation(key: string): Promise<any>;
  deleteDevice(key: string);
  createAlert(name: string, tipo: string, datos: string[], opcion: string, keyLand: string, keyPivot: string, keyDispositivo: string, timeAlert: string, timeLastAlert: string, silenced: boolean): Promise<any>;
  updateAlert(key: string, name: string, tipo: string, datos: string[], opcion: string, keyLand: string, keyPivot: string, keyDispositivo: string, timeAlert: string, timeLastAlert: string, silenced: boolean);
  deleteAlert(key: string);
  listAlerts(): Promise<any>;
  alertInformation(key: string): Promise<any>;
  
  createNotification(measurement: string, time: string, keyAlert: string): Promise<any>;
  deleteNotification(key: string);
  listNotification(): Promise<any>;
  notificationInformation(key: string): Promise<any>;
  
  userAutenticated(): Promise<boolean>;
  deviceExist(id: string): Promise<string>;
  checkDeviceMeasurement(id: string): Promise<any>;
  checkDeviceId(idDevice: string): Promise<any>;
  listMeasurements(idDevice: string): Promise<any>;
  appIcon(): Promise<string>;
  userProfileIcon(): Promise<string>;
}
