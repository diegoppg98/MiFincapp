import { RouteConfig } from 'vue-router/types/router';

export const HistoricoAlertaRoutes: RouteConfig[] = [
  {
    path: '/historico-alerta',
    name: 'historicoAlerta',
    component: () => import(/* webpackChunkName: "historico-alerta" */ './HistoricoAlerta/HistoricoAlerta.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
