import { IAppConfig } from '../config/IAppConfig';

export interface IAppState {
  locale: string;
  nombreFinca: string;
  nombrePivot: string;
  nombreDispositivo: string;
  nombreAlerta: string;
  config: IAppConfig;
  defaultMessages: any;
  redirectTo: string;
  cookieConsentVersion: string;
}

export const AppDefaultState = (): IAppState => {
  return {
    locale: null,
    nombreFinca: null,
    nombrePivot: null,
    nombreDispositivo: null,
    nombreAlerta: null,
    config: null,
    defaultMessages: {},
    redirectTo: null,
    cookieConsentVersion: '',
  };
};
