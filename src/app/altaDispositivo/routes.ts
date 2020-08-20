import { RouteConfig } from 'vue-router/types/router';

export const AltaDispositivoRoutes: RouteConfig[] = [
  {
    path: '/alta-dispositivo',
    name: 'altaDispositivo',
    component: () =>
      import(/* webpackChunkName: "alta-dispositivo" */ './AltaDispositivo/AltaDispositivo.vue').then(
        (m: any) => m.default,
      ),
    meta: {
      requiresAuth: true,
    },
  },
];
