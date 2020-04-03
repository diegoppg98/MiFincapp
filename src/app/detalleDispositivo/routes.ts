import { RouteConfig } from 'vue-router/types/router';

export const DetalleDispositivoRoutes: RouteConfig[] = [
  {
    path: '/detalle-dispositivo',
    name: 'detalleDispositivo',
    component: () => import(/* webpackChunkName: "detalle-dispositivo" */ './DetalleDispositivo/DetalleDispositivo.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
