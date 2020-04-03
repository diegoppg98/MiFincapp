import { RouteConfig } from 'vue-router/types/router';

export const AltaPivotRoutes: RouteConfig[] = [
  {
    path: '/alta-pivot',
    name: 'altaPivot',
    component: () => import(/* webpackChunkName: "alta-pivot" */ './AltaPivot/AltaPivot.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
