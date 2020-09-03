import Vue from 'vue';
import VueRouter, { Route, RouteRecord } from 'vue-router';
import Meta from 'vue-meta';
import { AppRoutes } from './app/routes';
import { HomeRoutes } from './home/routes';
import { PerfilRoutes } from './perfil/routes';
import { FincaRoutes } from './finca/routes';
import { AlertaRoutes } from './alerta/routes';
import { AltaFincaRoutes } from './altaFinca/routes';
import { AltaAlertaRoutes } from './altaAlerta/routes';
import { DetalleFincaRoutes } from './detalleFinca/routes';
import { DetallePivotRoutes } from './detallePivot/routes';
import { AltaPivotRoutes } from './altaPivot/routes';
import { DetalleDispositivoRoutes } from './detalleDispositivo/routes';
import { AltaDispositivoRoutes } from './altaDispositivo/routes';
import { RegistrarUsuarioRoutes } from './registrarUsuario/routes';
import { DashboardRoutes } from './dashboard/routes';
import { Database } from './interfaceDatabase';
import { ImplementationDatabase } from './firebaseImplementation';
import { DetalleAlertaRoutes } from './detalleAlerta/routes';
import { mapGetters } from 'vuex';
import { store } from './store';
import { NotificacionRoutes } from './notificacion/routes';
const FunctionsDatabase: Database = new ImplementationDatabase();
FunctionsDatabase.init();
Vue.use(VueRouter);
Vue.use(Meta);

export const router: VueRouter = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    ...AppRoutes,
    ...HomeRoutes,
    ...DashboardRoutes,
    ...PerfilRoutes,
    ...FincaRoutes,
    ...AlertaRoutes,
    ...AltaFincaRoutes,
    ...AltaAlertaRoutes,
    ...DetalleFincaRoutes,
    ...DetallePivotRoutes,
    ...AltaPivotRoutes,
    ...DetalleDispositivoRoutes,
    ...AltaDispositivoRoutes, 
    ...RegistrarUsuarioRoutes,
    ...DetalleAlertaRoutes,
    ...NotificacionRoutes],
  scrollBehavior(to: Route, from: Route, savedPosition: { x: number; y: number }) {
    if (to.hash) {
      return { selector: to.hash };
    }
    return savedPosition || { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {

var rutas = ["ayuda", "finca", "alta-finca", "alerta", "alta-dispositivo", "alta-pivot", "alta-alerta", "inicio", "notificacion", "detalle-finca", "detalle-pivot", "detalle-dispositivo", "detalle-pivot" ];

FunctionsDatabase.userAutenticated().then((user) =>{
  let autorizacion = to.matched.some(record => record.meta.requiresAuth);
  if (autorizacion && !user) {
    next('/');
  } else if (!autorizacion && user) {
         next('/perfil');
  } else if(from.name === null && rutas.includes(to.name)){ 
    next('/perfil'); 
  }
  else {
    next();
  }
}); 
});

