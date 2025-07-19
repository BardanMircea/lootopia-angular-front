import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ChasseService } from '../services/chasse.service';

@Component({
  standalone: true,
  selector: 'app-creer-chasse',
  template: `
    <h2>➕ Créer une nouvelle chasse</h2>
    <mat-card>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Titre</mat-label>
        <input matInput [(ngModel)]="titre" />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Description</mat-label>
        <input matInput [(ngModel)]="description" />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Latitude</mat-label>
        <input matInput type="number" [(ngModel)]="latitudeCache" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Longitude</mat-label>
        <input matInput type="number" [(ngModel)]="longitudeCache" />
      </mat-form-field>
      <p>
        Placer simplement la Cache sur la carte pour enregistrer ses
        coordonnées:
      </p>
      <div id="map" style="height: 300px; margin-bottom: 16px;"></div>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Date de début</mat-label>
        <input matInput type="date" [(ngModel)]="dateDebut" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Date de fin</mat-label>
        <input matInput type="date" [(ngModel)]="dateFin" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Nombre de participants</mat-label>
        <input
          matInput
          type="number"
          step="1"
          min="0"
          [(ngModel)]="nombreParticipants"
          placeholder="Illimité"
        />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Nombre d'étapes</mat-label>
        <input
          matInput
          type="number"
          step="1"
          min="0"
          [(ngModel)]="nombreEtapes"
        />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Type de monde</mat-label>
        <mat-select [(ngModel)]="typeMonde">
          <mat-option value="CARTOGRAPHIQUE">Cartographique</mat-option>
          <mat-option value="REEL">Réel</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Message lors de la découverte du cache</mat-label>
        <input matInput [(ngModel)]="messageCacheTrouve" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Frais de participation</mat-label>
        <input
          matInput
          type="number"
          step="1"
          min="0"
          [(ngModel)]="fraisParticipation"
        />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Type de récompense</mat-label>
        <mat-select [(ngModel)]="typeRecompense">
          <mat-option value="COURONNES">Couronnes</mat-option>
          <mat-option value="ARTEFACT">Artefact</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Montant de la récompense</mat-label>
        <input
          matInput
          step="1"
          min="0"
          type="number"
          [(ngModel)]="montantRecompense"
        />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Visibilité</mat-label>
        <mat-select [(ngModel)]="visibilite">
          <mat-option value="PUBLIC">Publique</mat-option>
          <mat-option value="PRIVE">Privée</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-raised-button color="primary" (click)="creerChasse()">
        ✅ Créer la chasse
      </button>
    </mat-card>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class CreerChassePage {
  private chasseService = inject(ChasseService);
  private router = inject(Router);

  description = '';
  latitudeCache = 48.8566;
  longitudeCache = 2.3522;
  typeMonde = 'CARTOGRAPHIQUE';
  messageCacheTrouve = '';
  fraisParticipation = 0;
  typeRecompense = 'COURONNES';
  montantRecompense = 100;
  visibilite = 'PUBLIC';
  titre = '';
  nombreParticipants = null;
  nombreEtapes = 0;
  dateDebut = new Date().toISOString().split('T')[0];
  dateFin = new Date(new Date().setDate(new Date().getDate() + 7))
    .toISOString()
    .split('T')[0];

  ngAfterViewInit() {
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: this.latitudeCache, lng: this.longitudeCache },
        zoom: 12,
      }
    );

    const marker = new google.maps.Marker({
      position: { lat: this.latitudeCache, lng: this.longitudeCache },
      map,
      draggable: true,
    });

    marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.latitudeCache = event.latLng.lat();
        this.longitudeCache = event.latLng.lng();
      }
    });

    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.latitudeCache = event.latLng.lat();
        this.longitudeCache = event.latLng.lng();
        marker.setPosition(event.latLng);
      }
    });
  }

  creerChasse() {
    this.chasseService
      .creerChasse({
        description: this.description,
        latitudeCache: this.latitudeCache,
        longitudeCache: this.longitudeCache,
        monde: this.typeMonde,
        messageCacheTrouve: this.messageCacheTrouve,
        fraisParticipation: this.fraisParticipation,
        typeRecompense: this.typeRecompense,
        montantRecompense: this.montantRecompense,
        visibilite: this.visibilite,
        titre: this.titre,
        dateDebut: this.dateDebut + 'T00:00:00',
        dateFin: this.dateFin + 'T00:00:00',
        nombreParticipants: Number(this.nombreParticipants),
        nombreEtapes: this.nombreEtapes,
      })
      .subscribe(() => {
        alert('✅ Chasse créée avec succès !');
        this.router.navigate(['/chasses/mes']);
      });
  }
}
