import { AbstractFactoryAPI } from './AbstractFactoryAPI';
import { FirebaseFactoryAPI } from './FirebaseFactoryAPI';

export class FactoryAPI {

    /**
     * Gets an instance of a FactoryAPI
     * @param {string} type - The type of factory
     */
    static getFactoryAPI(type: string): AbstractFactoryAPI {
        switch (type) {
            case 'Firebase':
                return new FirebaseFactoryAPI();

            default:
                throw new Error("Wrong PersistenceType");
        }
    }
}
