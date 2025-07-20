import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chasse, ChasseService } from '../../../services/chasse.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ParticipationService } from '../../../services/participation.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChasseDetailsDialogComponent } from '../chasse-details/chasse-details-dialog.component';

@Component({
  standalone: true,
  selector: 'app-chasses-publiques',
  templateUrl: './chasses-publiques.page.html',
  styleUrls: ['./chasses-publiques.page.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
})
export class ChassesPubliquesPage implements OnInit {
  private chasseService = inject(ChasseService);
  private participationService = inject(ParticipationService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  currentUserPseudo: string | undefined;
  chasses: any[] = [];
  participationChasseIds = new Set<number>();
  loading = true;
  participationsLoaded = false;
  chassesGagneesIds = new Set<number>();

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.currentUserPseudo = this.authService.getUserInfo()?.pseudo;
    this.participationService.getMesParticipations().subscribe({
      next: (participations) => {
        //  les IDs des chasses déja rejointes
        this.participationChasseIds = new Set(
          participations.map((p) => p.chasseId)
        );
        this.chassesGagneesIds = new Set(
          participations.filter((p) => p.cacheTrouvee).map((p) => p.chasseId)
        );
        this.participationsLoaded = true;
        console.log('Participations chargées :', this.participationChasseIds);
        this.loadPage();
      },
      error: () => {
        this.participationChasseIds = new Set();
        this.participationsLoaded = true;
        this.loadPage();
      },
    });
  }

  loadPage(event?: PageEvent): void {
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }

    this.loading = true;

    this.chasseService
      .getChassesPubliques(this.pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          this.chasses = data.content;
          console.log('Chasses chargées :', this.chasses);
          this.totalElements = data.totalElements;
          if (this.participationsLoaded) {
            this.mapChasses();
          }
          this.loading = false;
        },
        error: () => {
          this.chasses = [];
          this.loading = false;
        },
      });
  }

  participer(chasse: Chasse) {
    if (!confirm(`Souhaitez-vous participer à la chasse "${chasse.titre}" ?`))
      return;

    this.participationService.participer(chasse.id).subscribe({
      next: () => {
        alert('✅ Participation enregistrée !');
        this.participationChasseIds.add(chasse.id);
        this.mapChasses();
      },
      error: (err) => {
        console.error('Erreur de participation :', err);
        alert(err?.error?.message || '❌ Erreur lors de la participation.');
      },
    });
  }

  private mapChasses() {
    this.chasses = this.chasses.map((chasse) => {
      const estCreateur = chasse.createur === this.currentUserPseudo;
      const dejaInscrit = this.participationChasseIds.has(chasse.id);
      const gagnee = this.chassesGagneesIds.has(chasse.id);

      const dejaInscritFinal = estCreateur || dejaInscrit || gagnee;

      const label = estCreateur
        ? 'Organisateur'
        : gagnee
        ? 'Cache trouvée ✅'
        : dejaInscrit
        ? 'Déjà inscrit'
        : 'Participer';

      return {
        ...chasse,
        dejaInscrit: dejaInscritFinal,
        labelParticipation: label,
      };
    });
  }

  openDetails(chasse: Chasse) {
    this.dialog.open(ChasseDetailsDialogComponent, {
      data: {
        description: chasse.description,
        fraisParticipation: chasse.fraisParticipation,
        nombreParticipants: chasse.nombreParticipants,
        montantRecompense: chasse.montantRecompense,
        typeRecompense: 'Couronnes',
        nombreEtapes: chasse.nombreEtapes,
        createur: chasse.createur,
      },
    });
  }
}
