import { RouteConfig } from 'vue-router/types/router';

export const AltaAlertaRoutes: RouteConfig[] = [
  {
    path: '/alta-alerta',
    name: 'altaAlerta',
    component: () =>
      import(/* webpackChunkName: "alta-alerta" */ './AltaAlerta/AltaAlerta.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
