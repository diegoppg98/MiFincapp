import { IAppState } from './state';

export interface IAppGetters {
  getLocale(state: IAppState): string;
  getFinca(state: IAppState): Finca;
  getPivot(state: IAppState): Pivot;
  getDispositivo(state: IAppState): Dispositivo;
  getAlerta(state: IAppState): Alerta;
  getAvatarUsuario(state: IAppState): string;
  getUser(state: IAppState): boolean;
  getReload(state: IAppState): string;
  cookieConsentVersion(state: IAppState): string;
}

export const AppGetters: IAppGetters = {
  getLocale(state: IAppState): string {
    return state.locale;
  },
  getFinca(state: IAppState): Finca {
    return state.finca;
  },
  getPivot(state: IAppState): Pivot {
    return state.pivot;
  },
  getDispositivo(state: IAppState): Dispositivo {
    return state.dispositivo;
  },
  getAlerta(state: IAppState): Alerta {
    return state.alerta;
  },
  getAvatarUsuario(state: IAppState): string {
    return state.avatarUsuario;
  },
  getUser(state: IAppState): boolean {
    return state.user;
  },
  getReload(state: IAppState): string {
    return state.reload;
  },
  cookieConsentVersion(state: IAppState): string {
    return state.cookieConsentVersion;
  },
};
