import { IAppState } from './state';

export interface IAppGetters {
  getLocale(state: IAppState): string;
<<<<<<< HEAD
  getNombreFinca(state: IAppState): string;
  getNombrePivot(state: IAppState): string;
  getNombreDispositivo(state: IAppState): string;
  getNombreAlerta(state: IAppState): string;
=======

>>>>>>> origin/master
  cookieConsentVersion(state: IAppState): string;
}

export const AppGetters: IAppGetters = {
  getLocale(state: IAppState): string {
    return state.locale;
  },
<<<<<<< HEAD
  getNombreFinca(state: IAppState): string {
    return state.nombreFinca;
  },
  getNombrePivot(state: IAppState): string {
    return state.nombrePivot;
  },
  getNombreDispositivo(state: IAppState): string {
    return state.nombreDispositivo;
  },
  getNombreAlerta(state: IAppState): string {
    return state.nombreAlerta;
  },
=======
>>>>>>> origin/master
  cookieConsentVersion(state: IAppState): string {
    return state.cookieConsentVersion;
  },
};
