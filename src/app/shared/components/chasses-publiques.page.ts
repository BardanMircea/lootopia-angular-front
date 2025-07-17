import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chasse, ChasseService } from '../services/chasse.service';
import { Router } from '@angular/router';

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
      </mat-card>
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
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
})
export class ChassesPubliquesPage implements OnInit {
  private chasseService = inject(ChasseService);
  private router = inject(Router);

  constructor() {
    console.log('🧭 ChassesPubliquesPage loaded');
  }

  chasses: Chasse[] = [];
  loading = true;

  ngOnInit(): void {
    this.chasseService.getChassesPubliques().subscribe({
      next: (data) => {
        this.chasses = data;
        console.log('Chasses publiques:', this.chasses);
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/login']);
        this.chasses = [];
        this.loading = false;
      },
    });
  }
}
