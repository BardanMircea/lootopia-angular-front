import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/components/app-layout.component';
import { authGuard } from './auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'home-page', pathMatch: 'full' },
      {
        path: 'home-page',
        loadComponent: () =>
          import('./shared/components/home.page').then((m) => m.HomePage),
      },

      {
        path: 'chasses-publiques',
        loadComponent: () =>
          import('./shared/components/chasses-publiques.page').then(
            (m) => m.ChassesPubliquesPage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'mes-participations',
        loadComponent: () =>
          import('./shared/components/mes-participations.page').then(
            (m) => m.MesParticipationsPage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chasses/nouvelle',
        loadComponent: () =>
          import('./shared/components/creer-chasse.page').then(
            (m) => m.CreerChassePage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chasses/mes',
        loadComponent: () =>
          import('./shared/components/mes-chasses.page').then(
            (m) => m.MesChassesPage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chasses/:id/modifier',
        loadComponent: () =>
          import('./shared/components/modifier-chasse.page').then(
            (m) => m.ModifierChassePage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'etapes/ajouter',
        loadComponent: () =>
          import('./shared/components/ajouter-etape.page').then(
            (m) => m.AjouterEtapePage
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/pages/register/register.page').then(
            (m) => m.RegisterPage
          ),
      },
      {
        path: 'activate',
        loadComponent: () =>
          import('./auth/pages/activation/activation.page').then(
            (m) => m.ActivationPage
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
