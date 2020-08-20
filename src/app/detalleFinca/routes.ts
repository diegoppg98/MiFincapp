import { RouteConfig } from 'vue-router/types/router';

export const DetalleFincaRoutes: RouteConfig[] = [
  {
    path: '/detalle-finca',
    name: 'detalleFinca',
    component: () =>
      import(/* webpackChunkName: "detalle-finca" */ './DetalleFinca/DetalleFinca.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
