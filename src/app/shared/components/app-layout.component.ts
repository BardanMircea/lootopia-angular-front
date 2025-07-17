import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/">🏠 Accueil</a>

          <ng-container *ngIf="!isLoggedIn()">
            <a mat-list-item routerLink="/login">🔐 Se connecter</a>
            <a mat-list-item routerLink="/register">📝 Créer un compte</a>
          </ng-container>

          <ng-container *ngIf="isLoggedIn()">
            <a mat-list-item routerLink="/dashboard">📊 Tableau de bord</a>
            <a mat-list-item routerLink="/chasses-publiques"
              >🗺️ Chasses publiques</a
            >
            <a mat-list-item routerLink="/mes-participations"
              >🎯 Mes participations</a
            >

            <ng-container *ngIf="isAdmin()">
              <a mat-list-item routerLink="/chasses/mes"
                >📚 Mes chasses organisées</a
              >
              <a mat-list-item routerLink="/chasses/nouvelle"
                >➕ Créer une chasse</a
              >
              <a mat-list-item routerLink="/etapes/ajouter"
                >🧩 Ajouter des étapes</a
              >
            </ng-container>

            <a mat-list-item (click)="logout()">🚪 Déconnexion</a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span style="margin-left:auto;" *ngIf="isLoggedIn()">
            Bienvenue, <strong>{{ pseudo() }} !</strong>
          </span>
        </mat-toolbar>
        <main style="padding: 1rem;">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
      }

      mat-sidenav {
        width: 240px;
      }

      mat-toolbar {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    `,
  ],
})
export class AppLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  pseudo = () => this.auth.getUserInfo()?.pseudo || 'Utilisateur';

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    const token = this.auth.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.roles?.includes('ROLE_ADMIN');
    } catch (e) {
      return false;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
