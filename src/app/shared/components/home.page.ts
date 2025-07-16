import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [RouterLink, MatButtonModule, MatCardModule, CommonModule],
  template: `
    <mat-card>
      <h1>Bienvenue sur Lootopia !</h1>
      <nav>
        <button *ngIf="!isLoggedIn()" mat-button routerLink="/login">
          Se connecter
        </button>
        <button *ngIf="!isLoggedIn()" mat-button routerLink="/register">
          Créer un compte
        </button>
        <button
          mat-raised-button
          color="primary"
          routerLink="/dashboard"
          *ngIf="isLoggedIn()"
        >
          Accéder au tableau de bord
        </button>
      </nav>
    </mat-card>
  `,
})
export class HomePage {
  private auth = inject(AuthService);
  isLoggedIn = () => this.auth.isLoggedIn();
}
