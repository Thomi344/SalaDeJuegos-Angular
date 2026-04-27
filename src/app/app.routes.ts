import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./componentes/home/home').then(m=>m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./componentes/login/login').then(m=>m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./componentes/registro/registro').then(m=>m.Registro)
    },
    {
        path: 'quiensoy',
        loadComponent: () => import('./componentes/quiensoy/quiensoy').then(m=>m.Quiensoy)
    },
    {
        path: '',
        loadComponent: () => import('./componentes/home/home').then(m=>m.Home),
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./componentes/home/home').then(m=>m.Home)
    }

];
