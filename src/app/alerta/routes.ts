import { RouteConfig } from 'vue-router/types/router';

export const AlertaRoutes: RouteConfig[] = [
  {
    path: '/alerta',
    name: 'alerta',
    component: () => import(/* webpackChunkName: "alerta" */ './Alerta/Alerta.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
