import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChasseService,
  Chasse,
  NouvelleChasse,
} from '../services/chasse.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-mes-chasses',
  template: `
    <h2>📚 Mes chasses créées</h2>
    <div *ngIf="chasses.length === 0">Aucune chasse pour le moment.</div>

    <mat-card *ngFor="let chasse of chasses" style="margin-bottom: 16px;">
      <mat-card-title>{{ chasse.titre || 'Chasse sans titre' }}</mat-card-title>
      <mat-card-content>
        <p><strong>Description :</strong> {{ chasse.description }}</p>
        <p>
          <strong>Cache :</strong> ({{ chasse.latitudeCache }},
          {{ chasse.longitudeCache }})
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-stroked-button color="accent">✏️ Modifier</button>
      </mat-card-actions>
    </mat-card>
  `,
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class MesChassesPage implements OnInit {
  private chasseService = inject(ChasseService);
  chasses: NouvelleChasse[] = [];

  ngOnInit(): void {
    this.chasseService.getChassesOrganisateur().subscribe({
      next: (data) => (this.chasses = data),
    });
  }
}
