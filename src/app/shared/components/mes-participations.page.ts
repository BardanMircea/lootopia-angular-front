import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {
  ParticipationService,
  Participation,
} from '../services/participation.service';

@Component({
  standalone: true,
  selector: 'app-mes-participations',
  template: `
    <ng-container *ngIf="loading; else content">
      <div class="center-spinner">
        <mat-spinner></mat-spinner>
      </div>
    </ng-container>

    <ng-template #content>
      <h2>Mes participations</h2>
      <div *ngIf="participations.length === 0">
        Vous n'avez rejoint aucune chasse pour le moment.
      </div>

      <mat-card *ngFor="let p of participations" class="participation-card">
        <mat-card-title>{{ p.titreChasse }}</mat-card-title>
        <mat-card-content>
          <p>
            <strong>Inscrit depuis :</strong>
            {{ p.inscritDepuis | date : 'mediumDate' }}
          </p>
          <p><strong>Étape actuelle :</strong> {{ p.etapeCourante }}</p>
          <p><strong>Participants :</strong></p>
          <mat-list>
            <mat-list-item *ngFor="let pseudo of p.participants">{{
              pseudo
            }}</mat-list-item>
          </mat-list>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button color="primary" disabled>
            Voir progression (à venir)
          </button>
        </mat-card-actions>
        <mat-card-actions>
          <button
            mat-stroked-button
            color="warn"
            (click)="annulerParticipation(p)"
          >
            Annuler la participation
          </button>
        </mat-card-actions>
      </mat-card>
    </ng-template>
  `,
  styles: [
    `
      .participation-card {
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
    MatListModule,
    MatButtonModule,
  ],
})
export class MesParticipationsPage implements OnInit {
  private participationService = inject(ParticipationService);
  participations: Participation[] = [];
  loading = true;

  ngOnInit(): void {
    this.participationService.getMesParticipations().subscribe({
      next: (data) => {
        this.participations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement participations :', err);
        this.loading = false;
      },
    });
  }

  OnLoadPage() {
    this.ngOnInit();
  }

  annulerParticipation(participation: Participation) {
    if (!confirm(`Annuler la participation à "${participation.titreChasse}" ?`))
      return;

    this.participationService.annulerParticipation(participation.id).subscribe({
      next: () => {
        this.participations = this.participations.filter(
          (p) => p.id !== participation.id
        );
        alert('Participation annulée.');
      },
      error: (err) => {
        console.error('Erreur lors de l’annulation :', err);
        alert(err?.error?.message || 'Erreur lors de l’annulation.');
      },
    });
  }
}
