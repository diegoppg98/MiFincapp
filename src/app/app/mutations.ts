import { IAppState } from './state';
import {Finca} from '../Clases/Finca';
import {Pivot} from '../Clases/Pivot';
import {Dispositivo} from '../Clases/Dispositivo';
import {Alerta} from '../Clases/Alerta';

export interface IAppMutations {
  CHANGE_LOCALE(state: IAppState, locale: string): void;
  CHANGE_FINCA(state: IAppState, finca: Finca): void;
  CHANGE_PIVOT(state: IAppState, pivot: Pivot): void;
  CHANGE_DISPOSITIVO(state: IAppState, dispositivo: Dispositivo): void;
  CHANGE_ALERTA(state: IAppState, alerta: Alerta): void;
  CHANGE_AVATARUSUARIO(state: IAppState, avatarUsuario: string): void;
  CHANGE_USER(state: IAppState, user: boolean): void;
  CHANGE_RELOAD(state: IAppState, reload: string): void;
  SET_COOKIE_CONSENT_VERSION(state: IAppState, version: string): void;
}

export const AppMutations: IAppMutations = {
  CHANGE_LOCALE: (state: IAppState, locale: string) => {
    state.locale = locale;
  },
  CHANGE_FINCA: (state: IAppState, finca: Finca) => {
    state.finca = finca;
  },
  CHANGE_PIVOT: (state: IAppState, pivot: Pivot) => {
    state.pivot = pivot;
  },
  CHANGE_DISPOSITIVO: (state: IAppState, dispositivo: Dispositivo) => {
    state.dispositivo = dispositivo;
  },
  CHANGE_ALERTA: (state: IAppState, alerta: Alerta) => {
    state.alerta = alerta;
  },
  CHANGE_AVATARUSUARIO: (state: IAppState, avatarUsuario: string) => {
    state.avatarUsuario = avatarUsuario;
  },
  CHANGE_USER: (state: IAppState, user: boolean) => {
    state.user = user;
  },
  CHANGE_RELOAD: (state: IAppState, reload: string) => {
    state.reload = reload;
  },
  SET_COOKIE_CONSENT_VERSION: (state: IAppState, version: string) => {
    state.cookieConsentVersion = version;
  },
};
