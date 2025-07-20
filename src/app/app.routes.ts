import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'home-page', pathMatch: 'full' },
      {
        path: 'home-page',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },

      {
        path: 'chasses-publiques',
        loadComponent: () =>
          import(
            './pages/chasse/chasses-publiques/chasses-publiques.page'
          ).then((m) => m.ChassesPubliquesPage),
        canActivate: [authGuard],
      },
      {
        path: 'mes-participations',
        loadComponent: () =>
          import('./pages/participation/mes-participations.page').then(
            (m) => m.MesParticipationsPage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chasses/nouvelle',
        loadComponent: () =>
          import('./pages/chasse/creer-chasse/creer-chasse.page').then(
            (m) => m.CreerChassePage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chasses/mes',
        loadComponent: () =>
          import('./pages/chasse/mes-chasses/mes-chasses.page').then(
            (m) => m.MesChassesPage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chasses/:id/modifier',
        loadComponent: () =>
          import('./pages/chasse/modifier-chasse/modifier-chasse.page').then(
            (m) => m.ModifierChassePage
          ),
        canActivate: [authGuard],
      },
      {
        path: 'etapes/ajouter',
        loadComponent: () =>
          import('./pages/etape/ajouter-etape.page').then(
            (m) => m.AjouterEtapePage
          ),
      },
      {
        path: 'mon-compte',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/compte/mon-compte.page').then((m) => m.MonComptePage),
      },
      {
        path: 'admin/utilisateurs',
        loadComponent: () =>
          import('./pages/admin/admin-gestion-utilisateurs.page').then(
            (m) => m.AdminGestionUtilisateursPage
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'activate',
        loadComponent: () =>
          import('./auth/activation/activation.page').then(
            (m) => m.ActivationPage
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
