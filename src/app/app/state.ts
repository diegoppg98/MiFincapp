import { IAppConfig } from '../config/IAppConfig';

export interface IAppState {
  locale: string;
<<<<<<< HEAD
  nombreFinca: string;
  nombrePivot: string;
  nombreDispositivo: string;
  nombreAlerta: string;
=======
>>>>>>> origin/master
  config: IAppConfig;
  defaultMessages: any;
  redirectTo: string;
  cookieConsentVersion: string;
}

export const AppDefaultState = (): IAppState => {
  return {
    locale: null,
<<<<<<< HEAD
    nombreFinca: null,
    nombrePivot: null,
    nombreDispositivo: null,
    nombreAlerta: null,
=======
>>>>>>> origin/master
    config: null,
    defaultMessages: {},
    redirectTo: null,
    cookieConsentVersion: '',
  };
};
