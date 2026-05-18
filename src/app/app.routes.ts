import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard';
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
        path: 'chat',
        loadComponent: () => import('./componentes/chat/chat').then(m=>m.Chat),
        canActivate: [authGuardGuard]
    },
    {
        path: 'resultados',
        loadComponent: () => import('./componentes/resultados/resultados').then(m=>m.ResultadosComponent),
    },
    {
        path: '',
        loadChildren: () => import('./modulos/ahorcado/ahorcado-module').then(m=>m.AhorcadoModule),
        canActivate: [authGuardGuard]
    },
    {
        path: '',
        loadChildren: () => import('./modulos/mayor-menor/mayor-menor-module').then(m=>m.MayorMenorModule),
        canActivate: [authGuardGuard]
    },
    {
        path: '',
        loadChildren: () => import('./modulos/preguntados/preguntados-module').then(m=>m.PreguntadosModule),
        canActivate: [authGuardGuard]
    },
    {
        path: '',
        loadChildren: () => import('./modulos/logo-quiz/logo-quiz-module').then(m=>m.LogoQuizModule),
        canActivate: [authGuardGuard]
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
