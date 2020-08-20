import { IAppConfig } from '../config/IAppConfig';
import {Finca} from '../Clases/Finca';
import {Pivot} from '../Clases/Pivot';
import {Alerta} from '../Clases/Alerta';
import {Dispositivo} from '../Clases/Dispositivo';

export interface IAppState {
  locale: string;
  finca: Finca;
  pivot: Pivot;
  dispositivo: Dispositivo;
  alerta: Alerta;
  avatarUsuario: string;
  user: boolean;
  reload: string;
  config: IAppConfig;
  defaultMessages: any;
  redirectTo: string;
  cookieConsentVersion: string;
}

export const AppDefaultState = (): IAppState => {
  return {
    locale: null,
    finca: null,
    pivot: null,
    dispositivo: null,
    alerta: null,
    avatarUsuario: null,
    user: false,
    reload: null,
    config: null,
    defaultMessages: {},
    redirectTo: null,
    cookieConsentVersion: '',
  };
};
