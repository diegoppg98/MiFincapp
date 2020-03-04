

export interface Database {
    init();
    login(name:string, pass:string);
    logout();
    userInformation():string[];
    createUser(mail:string, pass:string , name:string, picture:string, address:string, phone:string); 
    updateUser(mail:string, pass:string , name:string, picture:string, address:string, phone:string); 
    deleteUser(); 
    createLand(name:string, description:string , location:string[], size:string, crop:string):string;
    updateLand(name:string, description:string , location:string[], size:string, crop:string);
    deleteLand(name:string);
    createPivot(name:string, description:string , location:string[], kind:string, nameLand:string); 
    updatePivot(name:string, description:string , location:string[], kind:string, nameLand:string); 
    deletePivot(name:string, nameLand:string);
    createDevice(name:string, tipo:string, description:string , location:string[], nameLand:string, namePivot:string);
    updateDevice(name:string, tipo:string, description:string , location:string[], nameLand:string, namePivot:string);
    deleteDevice(name:string, nameLand:string, namePivot:string);
    createAlert(location:string);
    updateAlert(location:string);
    listLands():string[];
    landInformation(name:string):string[];
    landExist(name:string):string;
    listPivots(nameLand:string):string[];
    pivotInformation(nameLand:string, name:string):string[];
    pivotExist(nameLand:string, name:string):string;
    listDevices(nameLand:string, namePivot:string):string[];
    deviceInformation(nameLand:string, namePivot:string, name:string):string[];
    deviceExist(nameLand:string, namePivot:string, name:string):string;
}

