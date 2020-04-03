import { RouteConfig } from 'vue-router/types/router';

export const DetallePivotRoutes: RouteConfig[] = [
  {
    path: '/detalle-pivot',
    name: 'detallePivot',
    component: () => import(/* webpackChunkName: "detalle-pivot" */ './DetallePivot/DetallePivot.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
