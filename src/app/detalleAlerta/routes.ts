import { RouteConfig } from 'vue-router/types/router';

export const DetalleAlertaRoutes: RouteConfig[] = [
  {
    path: '/detalle-alerta',
    name: 'detalleAlerta',
    component: () =>
      import(/* webpackChunkName: "detalle-alerta" */ './DetalleAlerta/DetalleAlerta.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
