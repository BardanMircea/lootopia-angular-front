import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
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
