import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../services/utilisateur.service';
import { AuthService } from '../../auth/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-mon-compte',
  templateUrl: 'mon-compte.page.html',
  styleUrls: ['mon-compte.page.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class MonComptePage implements OnInit {
  private utilisateurService = inject(UtilisateurService);
  private authService = inject(AuthService);

  utilisateur: any;

  ngOnInit(): void {
    const email = this.authService.getUserInfo()?.email;
    if (!email) return;

    this.utilisateurService.getUtilisateurConnecte(email).subscribe({
      next: (u) => (this.utilisateur = u),
      error: () => alert('Erreur chargement utilisateur.'),
    });
  }
}
