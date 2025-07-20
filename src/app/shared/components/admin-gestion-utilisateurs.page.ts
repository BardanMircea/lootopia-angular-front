import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, Utilisateur } from '../services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-gestion-utilisateurs',
  template: `
    <h2>👤 Gestion des utilisateurs</h2>

    <mat-card *ngIf="utilisateurs.length === 0">
      Aucun utilisateur enregistré.
    </mat-card>

    <mat-card *ngIf="utilisateurs.length > 0">
      <table
        mat-table
        [dataSource]="utilisateurs"
        class="mat-elevation-z2"
        style="width: 100%"
      >
        <ng-container matColumnDef="pseudo">
          <th mat-header-cell *matHeaderCellDef>Pseudo</th>
          <td mat-cell *matCellDef="let u">{{ u.pseudo }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let u">{{ masquerEmail(u.email) }}</td>
        </ng-container>

        <ng-container matColumnDef="partenaire">
          <th mat-header-cell *matHeaderCellDef>Type de compte</th>
          <td mat-cell *matCellDef="let u">
            {{ u.isPartenaire ? 'Partenaire' : 'Basique' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="dateInscription">
          <th mat-header-cell *matHeaderCellDef>Date d'inscription</th>
          <td mat-cell *matCellDef="let u">{{ u.dateInscription | date }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let u">
            <button
              mat-icon-button
              color="warn"
              (click)="supprimerUtilisateur(u.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colonnes"></tr>
        <tr mat-row *matRowDef="let row; columns: colonnes"></tr>
      </table>
    </mat-card>
  `,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AdminGestionUtilisateursPage implements OnInit {
  private adminService = inject(AdminService);
  utilisateurs: Utilisateur[] = [];
  colonnes = ['pseudo', 'email', 'partenaire', 'actions'];

  ngOnInit(): void {
    this.adminService.getAllUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        console.log('Utilisateurs chargés:', this.utilisateurs);
      },
      error: () => alert('Erreur chargement utilisateurs'),
    });
  }

  masquerEmail(email: string): string {
    const [name, domain] = email.split('@');
    const masked = name.slice(0, 2) + '***@' + domain;
    return masked;
  }

  supprimerUtilisateur(userId: number) {
    if (!confirm('Supprimer cet utilisateur ? Cette action est irréversible.'))
      return;

    this.adminService.supprimerUtilisateur(userId).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter((u) => u.id !== userId);
        alert('✅ Utilisateur supprimé');
      },
      error: () => alert('❌ Erreur lors de la suppression'),
    });
  }
}
