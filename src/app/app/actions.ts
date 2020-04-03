import { ActionContext } from 'vuex';
import { IAppState } from './state';

export interface IAppActions {
  changeLocale(context: ActionContext<IAppState, IAppState>, locale: string): void;
<<<<<<< HEAD
  changeNombreFinca(context: ActionContext<IAppState, IAppState>, nombreFinca: string): void;
  changeNombrePivot(context: ActionContext<IAppState, IAppState>, nombrePivot: string): void;
  changeNombreDispositivo(context: ActionContext<IAppState, IAppState>, nombreDispositivo: string): void;
  changeNombreAlerta(context: ActionContext<IAppState, IAppState>, nombreAlerta: string): void;
=======

>>>>>>> origin/master
  setCookieConsentVersion(context: ActionContext<IAppState, IAppState>, version: string): void;
}

export const AppActions: IAppActions = {
  changeLocale: ({ commit }: ActionContext<IAppState, IAppState>, locale: string) => commit('CHANGE_LOCALE', locale),
<<<<<<< HEAD
  changeNombreFinca: ({ commit }: ActionContext<IAppState, IAppState>, nombreFinca: string) => commit('CHANGE_NOMBREFINCA', nombreFinca),
  changeNombrePivot: ({ commit }: ActionContext<IAppState, IAppState>, nombrePivot: string) => commit('CHANGE_NOMBREPIVOT', nombrePivot),
  changeNombreDispositivo: ({ commit }: ActionContext<IAppState, IAppState>, nombreDispositivo: string) => commit('CHANGE_NOMBREDISPOSITIVO', nombreDispositivo),
  changeNombreAlerta: ({ commit }: ActionContext<IAppState, IAppState>, nombreAlerta: string) => commit('CHANGE_NOMBREALERTA', nombreAlerta),
=======
>>>>>>> origin/master
  setCookieConsentVersion: ({ commit }: ActionContext<IAppState, IAppState>, version: string) =>
    commit('SET_COOKIE_CONSENT_VERSION', version),
};
