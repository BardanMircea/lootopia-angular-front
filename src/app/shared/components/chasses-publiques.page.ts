import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chasse, ChasseService } from '../services/chasse.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ParticipationService } from '../services/participation.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-chasses-publiques',
  template: `
    <ng-container *ngIf="loading; else content">
      <div class="center-spinner">
        <mat-spinner></mat-spinner>
      </div>
    </ng-container>

    <ng-template #content>
      <h2>Chasses publiques disponibles</h2>
      <div *ngIf="chasses.length === 0">Aucune chasse disponible.</div>

      <mat-card *ngFor="let chasse of chasses" class="chasse-card">
        <mat-card-title>{{ chasse.titre }}</mat-card-title>
        <mat-card-content>
          <p><strong>Monde :</strong> {{ chasse.monde }}</p>
          <p>
            <strong>Dates :</strong> {{ chasse.dateDebut | date }} →
            {{ chasse.dateFin | date }}
          </p>
          <p *ngIf="chasse.description">{{ chasse.description }}</p>
          <p><strong>Organisateur :</strong> {{ chasse.createur }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="participer(chasse)"
            [disabled]="chasse.dejaInscrit"
          >
            {{
              chasse.dejaInscrit
                ? chasse.createur === currentUserPseudo
                  ? 'Organisateur'
                  : 'Déja inscrit'
                : 'Participer'
            }}
          </button>
        </mat-card-actions>
      </mat-card>
      <mat-paginator
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        [pageSizeOptions]="[5, 10, 20]"
        (page)="loadPage($event)"
      ></mat-paginator>
    </ng-template>
  `,
  styles: [
    `
      .chasse-card {
        margin-bottom: 16px;
      }
      .center-spinner {
        display: flex;
        justify-content: center;
        margin-top: 40px;
      }
    `,
  ],
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

  currentUserPseudo: string | undefined;
  chasses: Chasse[] = [];
  participationChasseIds = new Set<number>();
  loading = true;
  participationsLoaded = false;

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
    this.chasses = this.chasses.map((chasse) => ({
      ...chasse,
      dejaInscrit:
        this.participationChasseIds.has(chasse.id) ||
        chasse.createur === this.currentUserPseudo,
    }));
  }
}
