

export interface Database {
    init();
    login(name:string, pass:string);
    logout();
    userInformation():Promise<any>;
    createUser(mail:string, pass:string , name:string, picture:string, address:string, phone:string); 
    updateUser(mail:string, pass:string , name:string, picture:string, address:string, phone:string); 
    deleteUser(); 
    createLand(name:string, description:string , location:string[], size:string, crop:string);
    updateLand(name:string, description:string , location:string[], size:string, crop:string);
    deleteLand(name:string);
    listLands():Promise<any>;
    landInformation(name:string):Promise<any>;
    landExist(name:string):Promise<string>;
    createPivot(name:string, description:string , location:string[], kind:string, nameLand:string); 
    updatePivot(name:string, description:string , location:string[], kind:string, nameLand:string); 
    deletePivot(name:string, nameLand:string);
    listPivots(nameLand:string):Promise<any>;
    pivotInformation(nameLand:string, name:string):Promise<any>;
    pivotExist(nameLand:string, name:string):Promise<string>;
    createDevice(name:string, tipo:string, description:string , location:string[], nameLand:string, namePivot:string);
    updateDevice(name:string, tipo:string, description:string , location:string[], nameLand:string, namePivot:string);
    listDevices(nameLand:string, namePivot:string):Promise<any>;
    deviceInformation(nameLand:string, namePivot:string, name:string):Promise<any>;
    deviceExist(nameLand:string, namePivot:string, name:string):Promise<string>;
    deleteDevice(name:string, nameLand:string, namePivot:string);
    createAlert(name:string, tipo:string, description:string , datos:string[], opcion:string, nameLand:string, namePivot:string, nameDispositivo:string);
    updateAlert(name:string, tipo:string, description:string , datos:string[], opcion:string, nameLand:string, namePivot:string, nameDispositivo:string);
    deleteAlert(name:string);
    listAlerts():Promise<any>;
    alertInformation(name:string):Promise<any>;
    alertExist(name:string):Promise<string>;

    userAutenticated():Promise<boolean>;
}

