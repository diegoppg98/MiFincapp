import { IAppState } from './state';

export interface IAppMutations {
  CHANGE_LOCALE(state: IAppState, locale: string): void;
<<<<<<< HEAD
  CHANGE_NOMBREFINCA(state: IAppState, nombreFinca: string): void;
  CHANGE_NOMBREPIVOT(state: IAppState, nombrePivot: string): void;
  CHANGE_NOMBREDISPOSITIVO(state: IAppState, nombreDispositivo: string): void;
  CHANGE_NOMBREALERTA(state: IAppState, nombreAlerta: string): void;
=======

>>>>>>> origin/master
  SET_COOKIE_CONSENT_VERSION(state: IAppState, version: string): void;
}

export const AppMutations: IAppMutations = {
  CHANGE_LOCALE: (state: IAppState, locale: string) => {
    state.locale = locale;
  },
<<<<<<< HEAD
  CHANGE_NOMBREFINCA: (state: IAppState, nombreFinca: string) => {
    state.nombreFinca = nombreFinca;
  },
  CHANGE_NOMBREPIVOT: (state: IAppState, nombrePivot: string) => {
    state.nombrePivot = nombrePivot;
  },
  CHANGE_NOMBREDISPOSITIVO: (state: IAppState, nombreDispositivo: string) => {
    state.nombreDispositivo = nombreDispositivo;
  },
  CHANGE_NOMBREALERTA: (state: IAppState, nombreAlerta: string) => {
    state.nombreAlerta = nombreAlerta;
  },
=======
>>>>>>> origin/master
  SET_COOKIE_CONSENT_VERSION: (state: IAppState, version: string) => {
    state.cookieConsentVersion = version;
  },
};
