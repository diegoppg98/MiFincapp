import { IAppState } from './state';

export interface IAppGetters {
  getLocale(state: IAppState): string;
  getNombreFinca(state: IAppState): string;
  getNombrePivot(state: IAppState): string;
  getNombreDispositivo(state: IAppState): string;
  getNombreAlerta(state: IAppState): string;
  cookieConsentVersion(state: IAppState): string;
}

export const AppGetters: IAppGetters = {
  getLocale(state: IAppState): string {
    return state.locale;
  },
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
  cookieConsentVersion(state: IAppState): string {
    return state.cookieConsentVersion;
  },
};
