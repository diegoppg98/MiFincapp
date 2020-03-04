import { RouteConfig } from 'vue-router/types/router';

export const FincaRoutes: RouteConfig[] = [
  {
    path: '/finca',
    name: 'finca',
    component: () => import(/* webpackChunkName: "finca" */ './Finca/Finca.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
