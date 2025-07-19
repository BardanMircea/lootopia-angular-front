import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [MatButtonModule, MatCardModule, CommonModule],
  template: `
    <mat-card>
      <div *ngIf="!isLoggedIn()">
        <h1>Bienvenue sur Lootopia !</h1>
        <p>
          Plongez dans l'univers de Lootopia, un jeu de chasse au trésor
          interactif où vous créez, explorez et dénichez des trésors cachés !
        </p>
        <p>
          Que vous soyez joueur ou organisateur, Lootopia vous permet de
          participer à des chasses cartographiques, de valider des étapes à
          l'aide de passphrases, de repères ou de coordonnées, et de remporter
          des récompenses.
        </p>
        <p>
          Préparez-vous à creuser, résoudre des énigmes et défier les autres
          dans une aventure ludique accessible à tous.
        </p>
        <p>Lootopia, là où chaque clic peut vous mener au trésor. 🧭</p>

        <h5>🔐 Connectez-vous pour commencer !</h5>
        <p>
          Rejoignez-nous pour participer à des chasses au trésor palpitantes et
          découvrir un monde rempli de surprises.
        </p>
      </div>

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
          routerLink="/chasses-publiques"
          *ngIf="isLoggedIn()"
        >
          Accéder aux chasses !
        </button>
      </nav>
    </mat-card>
  `,
})
export class HomePage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = () => this.auth.isLoggedIn();

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/chasses-publiques']);
    }
  }
}
