import { ActionContext } from 'vuex';
import { IAppState } from './state';

export interface IAppActions {
  changeLocale(context: ActionContext<IAppState, IAppState>, locale: string): void;
  changeFinca(context: ActionContext<IAppState, IAppState>, finca: Finca): void;
  changePivot(context: ActionContext<IAppState, IAppState>, pivot: Pivot): void;
  changeDispositivo(context: ActionContext<IAppState, IAppState>, dispositivo: Dispositivo): void;
  changeAlerta(context: ActionContext<IAppState, IAppState>, alerta: Alerta): void;
  changeAvatarUsuario(context: ActionContext<IAppState, IAppState>, avatarUsuario: string): void;
  changeUser(context: ActionContext<IAppState, IAppState>, user: boolean): void;
  changeReload(context: ActionContext<IAppState, IAppState>, reload: string): void;
  setCookieConsentVersion(context: ActionContext<IAppState, IAppState>, version: string): void;
}

export const AppActions: IAppActions = {
  changeLocale: ({ commit }: ActionContext<IAppState, IAppState>, locale: string) => commit('CHANGE_LOCALE', locale),
  changeFinca: ({ commit }: ActionContext<IAppState, IAppState>, finca: Finca) =>
    commit('CHANGE_FINCA', finca),
  changePivot: ({ commit }: ActionContext<IAppState, IAppState>, pivot: Pivot) =>
    commit('CHANGE_PIVOT', pivot),
  changeDispositivo: ({ commit }: ActionContext<IAppState, IAppState>, dispositivo: Dispositivo) =>
    commit('CHANGE_DISPOSITIVO', dispositivo),
  changeAlerta: ({ commit }: ActionContext<IAppState, IAppState>, alerta: Alerta) =>
    commit('CHANGE_ALERTA', alerta),
  changeAvatarUsuario: ({ commit }: ActionContext<IAppState, IAppState>, avatarUsuario: string) =>
    commit('CHANGE_AVATARUSUARIO', avatarUsuario),
  changeUser: ({ commit }: ActionContext<IAppState, IAppState>, user: boolean) =>
    commit('CHANGE_USER', user),
    changeReload: ({ commit }: ActionContext<IAppState, IAppState>, reload: string) =>
    commit('CHANGE_RELOAD', reload),
  setCookieConsentVersion: ({ commit }: ActionContext<IAppState, IAppState>, version: string) =>
    commit('SET_COOKIE_CONSENT_VERSION', version),
};
