import Vue from 'vue';
import VueRouter, { Route, RouteRecord } from 'vue-router';
import Meta from 'vue-meta';
import { AppRoutes } from './app/routes';
import { HomeRoutes } from './home/routes';
import { AyudaRoutes } from './ayuda/routes';
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
import { DashboardRoutes } from './example/dashboard/routes';
import { Database } from './interfaceDatabase';
import { ImplementationDatabase } from './firebaseImplementation';
import { DetalleAlertaRoutes } from './detalleAlerta/routes';
import { mapGetters } from 'vuex';
import { store } from './store';
import { NotificacionRoutes } from './notificacion/routes';
import { HistoricoAlertaRoutes } from './historicoAlerta/routes';
const FunctionsDatabase: Database = new ImplementationDatabase();
FunctionsDatabase.init();
Vue.use(VueRouter);
Vue.use(Meta);

/*

import { CounterRoutes } from './example/counter/routes';
import { FormRoutes } from './example/form/routes';
...HistoricoAlertaRoutes,
...CounterRoutes,
...FormRoutes,
*/

export const router: VueRouter = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    ...AppRoutes,
    ...HomeRoutes,
    ...DashboardRoutes,
    ...AyudaRoutes,
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
    ...HistoricoAlertaRoutes,
    ...NotificacionRoutes],
  scrollBehavior(to: Route, from: Route, savedPosition: { x: number; y: number }) {
    if (to.hash) {
      return { selector: to.hash };
    }
    return savedPosition || { x: 0, y: 0 };
  },
});


 //IF user ->firebaseIMplementation
router.beforeEach((to, from, next) => {

var rutas = ["ayuda", "finca", "alta-finca", "alerta", "alta-dispositivo", "alta-pivot", "alta-alerta", "inicio", "notificacion", "detalle-finca", "detalle-pivot", "detalle-dispositivo", "detalle-pivot" ];

FunctionsDatabase.userAutenticated().then((user) =>{

  //const isAuthenticated = store.getters['app/getUser'];

  let autorizacion = to.matched.some(record => record.meta.requiresAuth);
//console.log(autorizacion);console.log(user);
  if (autorizacion && !user) {
    next('/');
  } else if (!autorizacion && user) {
         next('/perfil');//cargando
    //next({ path: '/example/dashboard', query: { redirect: to.fullPath } });
  } else if(from.name === null && rutas.includes(to.name)){ console.log("A");
    next('/perfil'); 
  }
  else {
    next();
  }
//});
//LOADING
//https://medium.muz.li/top-30-most-captivating-preloaders-for-your-website-95ed1beff99d
//https://www.w3schools.com/howto/howto_css_loader.asp
//https://steelkiwi.com/blog/30-most-captivating-preloaders-for-website/
}); 

});
// example guard
// TODO remove or adjust in production code
/*router.beforeEach((to: Route, from: Route, next: any) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const autorizacion = to.matched.some((record: RouteRecord) => record.meta.requiresAuth);


     firebase.auth().onAuthStateChanged(function(user) {
console.log(user);
 if (autorizacion && !user) {
    next({ path: '/', query: { redirect: to.fullPath } });
  } else if (!autorizacion && user) {
    next({ path: '/example/dashboard', query: { redirect: to.fullPath } });
  } else { 
    next();
  }

  });
});
 /* if (autorizacion && !isAuthenticated) {
    next({ path: '/', query: { redirect: to.fullPath } });
  } else if (!autorizacion && isAuthenticated) {
    next({ path: '/example/dashboard', query: { redirect: to.fullPath } });
  } else {
    next();
  }*/
//});

/*router.beforeEach((to: Route, from: Route, next: any) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const user = firebase.auth().currentUser;
  console.log(isAuthenticated);console.log(isAuthenticated);console.log(isAuthenticated);
  console.log(user);
  if (to.matched.some((record: RouteRecord) => record.meta.requiresAuth)) {
    const isAuthenticated = store.getters['auth/isAuthenticated'];

    if (!isAuthenticated) {
      next({ path: '/', query: { redirect: to.fullPath } });
    } else{
       //FALLO RELOAD
	next();
    }
  } else {
    next();
  }
});*/
