import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, Utilisateur } from '../../services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-gestion-utilisateurs',
  templateUrl: './admin-gestion-utilisateurs.page.html',
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
