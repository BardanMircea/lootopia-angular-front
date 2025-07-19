import { AfterViewInit, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EtapeService, EtapeCreationDto } from '../services/etape.service';

@Component({
  standalone: true,
  selector: 'app-ajouter-etape',
  template: `
    <h2>➕ Ajouter une étape</h2>
    <mat-card>
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Ordre</mat-label>
        <input matInput type="number" [(ngModel)]="ordre" />
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Consigne</mat-label>
        <input matInput [(ngModel)]="consigne" />
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Type de validation</mat-label>
        <mat-select
          [(ngModel)]="typeValidation"
          (selectionChange)="onTypeChanged()"
        >
          <mat-option value="PASSPHRASE">Passphrase</mat-option>
          <mat-option value="CACHE">Cache</mat-option>
          <mat-option value="REPERE">Repère</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field
        *ngIf="typeValidation === 'PASSPHRASE'"
        class="full-width"
        appearance="fill"
      >
        <mat-label>Passphrase</mat-label>
        <input matInput [(ngModel)]="passphrase" />
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Prix validation directe</mat-label>
        <input matInput type="number" [(ngModel)]="prixValidationDirecte" />
      </mat-form-field>

      <ng-container *ngIf="typeValidation === 'CACHE'">
        <mat-form-field class="full-width" appearance="fill">
          <mat-label>Latitude cache</mat-label>
          <input matInput type="number" [(ngModel)]="latitudeCache" />
        </mat-form-field>

        <mat-form-field class="full-width" appearance="fill">
          <mat-label>Longitude cache</mat-label>
          <input matInput type="number" [(ngModel)]="longitudeCache" />
        </mat-form-field>
        <div id="map" style="height: 300px; margin-bottom: 16px;"></div>
      </ng-container>

      <mat-form-field
        *ngIf="typeValidation === 'REPERE'"
        class="full-width"
        appearance="fill"
      >
        <mat-label>Repère RA</mat-label>
        <input matInput [(ngModel)]="repereRa" />
      </mat-form-field>

      <button mat-raised-button color="primary" (click)="soumettreEtape()">
        ✅ Ajouter l'étape
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class AjouterEtapePage implements AfterViewInit {
  chasseId!: number;
  ordre = 1;
  consigne = '';
  typeValidation = 'PASSPHRASE';
  passphrase = '';
  prixValidationDirecte = 0;
  latitudeCache = 0;
  longitudeCache = 0;
  repereRa = '';
  private etapeService = inject(EtapeService);
  private router = inject(Router);
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.chasseId = +params['chasseId'];
    });
  }

  ngAfterViewInit(): void {
    if (this.typeValidation === 'CACHE') {
      setTimeout(() => this.initMap(), 200);
    }
  }

  onTypeChanged(): void {
    if (this.typeValidation === 'CACHE') {
      setTimeout(() => this.initMap(), 200);
    }
  }

  private initMap(): void {
    const center = {
      lat: this.latitudeCache || 48.8566,
      lng: this.longitudeCache || 2.3522,
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center,
        zoom: 12,
      }
    );

    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      draggable: true,
      icon: {
        url: 'treasureChest.png',
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.latitudeCache = event.latLng.lat();
        this.longitudeCache = event.latLng.lng();
      }
    });

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.latitudeCache = event.latLng.lat();
        this.longitudeCache = event.latLng.lng();
        this.marker.setPosition(event.latLng);
      }
    });
  }

  soumettreEtape() {
    const dto: EtapeCreationDto = {
      chasseId: this.chasseId,
      ordre: this.ordre,
      consigne: this.consigne,
      typeValidation: this.typeValidation as any,
      prixValidationDirecte: this.prixValidationDirecte,
      passphrase:
        this.typeValidation === 'PASSPHRASE' ? this.passphrase : undefined,
      latitudeCache:
        this.typeValidation === 'CACHE' ? this.latitudeCache : undefined,
      longitudeCache:
        this.typeValidation === 'CACHE' ? this.longitudeCache : undefined,
      repereRa: this.typeValidation === 'REPERE' ? this.repereRa : undefined,
    };

    this.etapeService.creerEtape(dto).subscribe({
      next: () => {
        alert('✅ Étape ajoutée avec succès !');
        this.router.navigate(['/chasses/mes']);
      },
      error: () => alert('❌ Erreur lors de l’ajout de l’étape.'),
    });
  }
}
