import { Routes } from '@angular/router';
import { LoginPage } from './auth/pages/login/login.page';
import { RegisterPage } from './auth/pages/register/register.page';
import { HomePage } from '../app/shared/components/home.page';
import { ActivationPage } from './auth/pages/activation/activation.page';
import { DashboardPage } from './shared/components/dashboard.page';
import { authGuard } from './auth/guards/auth.guard';
import { AppLayoutComponent } from './shared/components/app-layout.component';
import { ChassesPubliquesPage } from './shared/components/chasses-publiques.page';
import { MesParticipationsPage } from './shared/components/mes-participations.page';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: HomePage },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: 'activate', component: ActivationPage },
      { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
      {
        path: 'chasses-publiques',
        component: ChassesPubliquesPage,
        canActivate: [authGuard],
      },
      {
        path: 'mes-participations',
        component: MesParticipationsPage,
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
