import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {
  ParticipationService,
  Participation,
} from '../services/participation.service';
import { CreusageService } from '../services/creusage.service';

@Component({
  standalone: true,
  selector: 'app-mes-participations',
  template: `
    <ng-container *ngIf="loading(); else content">
      <div class="center-spinner">
        <mat-spinner></mat-spinner>
      </div>
    </ng-container>

    <ng-template #content>
      <h2>Mes participations</h2>
      <div *ngIf="participations().length === 0">
        Vous n'avez rejoint aucune chasse pour le moment.
      </div>

      <mat-card *ngFor="let p of participations()" class="participation-card">
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
          <button
            mat-stroked-button
            color="warn"
            (click)="annulerParticipation(p)"
          >
            Annuler la participation
          </button>
          <button
            mat-raised-button
            color="accent"
            [disabled]="!p.eligibleCreusage"
            (click)="initierCreusage(p)"
          >
            {{ p.eligibleCreusage ? 'Creuser' : 'Creusage indisponible' }}
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="modeCreusage()">
        <h3>🔍 Choisis un emplacement sur la carte</h3>
        <div id="map" style="height: 400px; margin-top: 10px;"></div>
        <button
          mat-raised-button
          color="primary"
          (click)="validerCreusage()"
          style="margin-top: 10px"
        >
          Valider le creusage
        </button>
      </div>
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
  private creusageService = inject(CreusageService);

  participations: WritableSignal<Participation[]> = signal([]);
  loading = signal(true);
  modeCreusage = signal(false);
  private currentChasseId: number | null = null;
  private selectedCoords: { lat: number; lng: number } | null = null;

  ngOnInit(): void {
    this.participationService.getMesParticipations().subscribe({
      next: (data) => {
        this.participations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement participations :', err);
        this.participations.set([]);
        this.loading.set(false);
      },
    });
  }

  annulerParticipation(participation: Participation) {
    if (!confirm(`Annuler la participation à "${participation.titreChasse}" ?`))
      return;

    this.participationService.annulerParticipation(participation.id).subscribe({
      next: () => {
        this.participations.set(
          this.participations().filter((p) => p.id !== participation.id)
        );
        alert('Participation annulée.');
      },
      error: (err) => {
        console.error('Erreur lors de l’annulation :', err);
        alert(err?.error?.message || 'Erreur lors de l’annulation.');
      },
    });
  }

  initierCreusage(participation: Participation) {
    this.currentChasseId = participation.chasseId;
    this.modeCreusage.set(true);

    setTimeout(() => {
      const mapEl = document.getElementById('map');
      if (!mapEl) return;

      const map = new google.maps.Map(mapEl, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 12,
      });

      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          this.selectedCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          new google.maps.Marker({
            position: this.selectedCoords,
            map,
          });
        }
      });
    }, 0);
  }

  validerCreusage() {
    if (!this.currentChasseId || !this.selectedCoords) {
      alert('Veuillez sélectionner un point sur la carte.');
      return;
    }

    const creusage = {
      chasseId: this.currentChasseId,
      latitude: this.selectedCoords.lat,
      longitude: this.selectedCoords.lng,
    };

    this.creusageService.creuser(creusage).subscribe({
      next: () => {
        alert('✅ Creusage effectué avec succès !');
        this.modeCreusage.set(false);
        this.currentChasseId = null;
        this.selectedCoords = null;
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || '❌ Erreur lors du creusage.');
      },
    });
  }
}
