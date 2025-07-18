import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  ParticipationService,
  Participation,
} from '../services/participation.service';
import { CreusageService } from '../services/creusage.service';

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
            <strong>Participe depuis :</strong>
            {{ p.inscritDepuis | date : 'mediumDate' }}
          </p>
          <p>
            <strong>Étape actuelle :</strong>
            {{ p.etapeCourante === -1 ? 'Sans étpe' : p.etapeCourante }}
          </p>
          <p><strong>Participants :</strong></p>
          <mat-list>
            <mat-list-item *ngFor="let pseudo of p.participants">{{
              pseudo
            }}</mat-list-item>
          </mat-list>

          <div *ngIf="successMessages[p.id]" style="margin-top: 10px;">
            🎉 {{ successMessages[p.id] }} Cache trouvé! Récompense ajoutée :
            {{ recompense }} 🪙
          </div>
          <div *ngIf="failedCreusages[p.id] && !canRetry(p.id)">
            ❌ Creusage raté. Réessayer dans
            {{ retryCountdowns[p.id] || '...' }}.
          </div>
        </mat-card-content>

        <mat-card-actions
          *ngIf="!successMessages[p.id] || failedCreusages[p.id]"
        >
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
            [disabled]="!p.eligibleCreusage || failedCreusages[p.id]"
            (click)="initierCreusage(p)"
          >
            {{
              failedCreusages[p.id]
                ? 'Attendre (' + (retryCountdowns[p.id] || '...') + ')'
                : 'Creuser'
            }}
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="modeCreusage" class="creusage-zone">
        <h3>🔍 Sélectionnez un point pour creuser</h3>
        <div class="coords-inputs">
          <label>Latitude : <input type="number" [(ngModel)]="lat" /></label>
          <label>Longitude : <input type="number" [(ngModel)]="lng" /></label>
        </div>
        <div id="map" style="height: 400px; margin-top: 8px;"></div>
        <button mat-raised-button color="primary" (click)="validerCreusage()">
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
      .creusage-zone {
        margin-top: 32px;
        padding: 16px;
        border: 1px dashed gray;
        border-radius: 8px;
      }
      .coords-inputs {
        display: flex;
        gap: 16px;
        margin-bottom: 8px;
      }
      input {
        width: 120px;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class MesParticipationsPage implements OnInit {
  private participationService = inject(ParticipationService);
  private creusageService = inject(CreusageService);

  participations: Participation[] = [];
  loading = true;

  modeCreusage = false;
  currentParticipation: Participation | null = null;
  lat: number = 48.8566;
  lng: number = 2.3522;
  recompense: number = 0;
  dateValidation: Date | null = null;

  successMessages: Record<number, string> = {};
  failedCreusages: Record<number, Date> = {};
  retryCountdowns: Record<number, string> = {};

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
    this.loadFailedCreusagesFromLocalStorage();

    // Mise à jour automatique des compte à rebours
    setInterval(() => this.updateCountdowns(), 1000);
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

  initierCreusage(participation: Participation) {
    this.currentParticipation = participation;
    this.modeCreusage = true;
    this.lat = 48.8566;
    this.lng = 2.3522;

    setTimeout(() => {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: this.lat, lng: this.lng },
          zoom: 12,
        }
      );

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          this.lat = e.latLng.lat();
          this.lng = e.latLng.lng();
          new google.maps.Marker({
            position: { lat: this.lat, lng: this.lng },
            map,
          });
        }
      });
    }, 100);
  }

  validerCreusage() {
    if (!this.currentParticipation) return;

    this.creusageService
      .creuser({
        chasseId: this.currentParticipation.chasseId,
        latitude: this.lat,
        longitude: this.lng,
      })
      .subscribe({
        next: (res) => {
          const message = res?.message?.toLowerCase() || '';
          console.log('Réponse creusage :', res);
          this.recompense = res?.gainCouronnes || 0;

          if (res?.success === false) {
            this.failedCreusages[this.currentParticipation!.id] = new Date(
              Date.now() + 24 * 3600 * 1000
            );
            this.modeCreusage = false;
            alert('Creusage incorrect. Réessayez plus tard');
            this.saveFailedCreusagesToLocalStorage();
            return;
          }

          // Succès réel
          this.successMessages[this.currentParticipation!.id] =
            res?.message || 'Cache trouvé ! Récompense ajoutée.';
          this.modeCreusage = false;
        },
        error: () => {
          // Cas d’erreur réelle (timeout, 500, etc.)
          this.failedCreusages[this.currentParticipation!.id] = new Date(
            Date.now() + 24 * 3600 * 1000
          );
          this.modeCreusage = false;
          this.saveFailedCreusagesToLocalStorage();
          alert('Erreur lors du creusage. Réessayez plus tard.');
        },
      });
  }

  updateCountdowns() {
    const now = new Date().getTime();
    Object.entries(this.failedCreusages).forEach(([id, until]) => {
      const remaining = new Date(until).getTime() - now;
      if (remaining <= 0) {
        delete this.failedCreusages[+id];
        delete this.retryCountdowns[+id];
        this.saveFailedCreusagesToLocalStorage();
      } else {
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        this.retryCountdowns[+id] = `${hrs}h ${mins}m ${secs}s`;
      }
    });
  }

  canRetry(participationId: number): boolean {
    return !this.failedCreusages[participationId];
  }

  private saveFailedCreusagesToLocalStorage() {
    const data: Record<number, string> = {};
    for (const [key, date] of Object.entries(this.failedCreusages)) {
      data[+key] = new Date(date).toISOString();
    }
    localStorage.setItem('failedCreusages', JSON.stringify(data));
  }
  private loadFailedCreusagesFromLocalStorage() {
    const raw = localStorage.getItem('failedCreusages');
    if (!raw) return;

    try {
      const parsed: Record<number, string> = JSON.parse(raw);
      for (const [id, isoString] of Object.entries(parsed)) {
        const retryDate = new Date(isoString);
        if (retryDate.getTime() > Date.now()) {
          this.failedCreusages[+id] = retryDate;
        }
      }
    } catch (e) {
      console.error('Erreur parsing failedCreusages localStorage', e);
    }
  }
}
