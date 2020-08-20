import { RouteConfig } from 'vue-router/types/router';

export const AltaFincaRoutes: RouteConfig[] = [
  {
    path: '/alta-finca',
    name: 'altaFinca',
    component: () =>
      import(/* webpackChunkName: "alta-finca" */ './AltaFinca/AltaFinca.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
