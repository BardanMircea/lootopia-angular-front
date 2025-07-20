import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';
import { UtilisateurService } from '../services/utilisateur.service';

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
          <ng-container *ngIf="!isLoggedIn()">
            <a mat-list-item routerLink="/login">🔐 Se connecter</a>
            <a mat-list-item routerLink="/register">📝 Créer un compte</a>
          </ng-container>

          <ng-container *ngIf="isLoggedIn() && role === 'ADMIN'">
            <a mat-list-item routerLink="/admin/utilisateurs"
              >🛡️ Gérer les utilisateurs</a
            >
          </ng-container>

          <a
            *ngIf="isLoggedIn() && role === 'USER'"
            mat-list-item
            routerLink="/mon-compte"
            >👤 Géstion de compte</a
          >
          <!-- 🔓 DECONNEXION -->
          <a *ngIf="isLoggedIn()" mat-list-item (click)="logout()"
            >🚪 Déconnexion</a
          >

          <ng-container *ngIf="isLoggedIn() && role === 'USER'">
            <h4 style="margin-left: 8px; margin-top: 16px;">🎮 Joueur</h4>
            <a mat-list-item routerLink="/chasses-publiques"
              >🗺️ Chasses publiques</a
            >
            <a mat-list-item routerLink="/mes-participations"
              >🎯 Mes participations</a
            >

            <h4 style="margin-left: 8px; margin-top: 16px;">🛠️ Organisateur</h4>
            <a mat-list-item routerLink="/chasses/nouvelle"
              >➕ Créer une chasse</a
            >
            <a mat-list-item routerLink="/chasses/mes">📚 Mes chasses</a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar *ngIf="isLoggedIn()" color="primary">
          <span style="margin-left:auto;">
            Connecté en tant que <strong>{{ pseudo() }}</strong
            ><br />
            <div *ngIf="role === 'USER'">
              Solde 💰: {{ this.soldeCouronnes() }} couronnes
            </div>
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
  private utilisateurService = inject(UtilisateurService);
  soldeCouronnes = computed(() => this.utilisateurService.soldeCouronnes());
  pseudo = () => this.auth.getUserInfo()?.pseudo;
  role: string = '';

  ngOnInit() {
    this.updateRoleFromLocalStorage();
    this.router.events.subscribe(() => {
      this.updateRoleFromLocalStorage();
    });

    const email = this.auth.getUserInfo()?.email;
    if (email) {
      this.utilisateurService.mettreAJourSolde(email);
    }
  }

  private updateRoleFromLocalStorage() {
    this.role = this.auth.getUserRole();
  }

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
