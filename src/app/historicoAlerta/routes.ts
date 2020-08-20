import { RouteConfig } from 'vue-router/types/router';

export const HistoricoAlertaRoutes: RouteConfig[] = [
  {
    path: '/cargando',
    name: 'cargando',
    component: () =>
      import(/* webpackChunkName: "historico-alerta" */ './HistoricoAlerta/HistoricoAlerta.vue').then(
        (m: any) => m.default,
      ),
    meta: {
      requiresAuth: true,
    },
  },
];
