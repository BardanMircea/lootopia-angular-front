import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-chasse-details-dialog',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Détails de la chasse</h2>
    <mat-card>
      <mat-card-title>{{ data.titre }}</mat-card-title>
      <mat-card-content>
        <p><strong>Description :</strong> {{ data.description || '—' }}</p>
        <p>
          <strong>Frais de participation :</strong>
          {{ data.fraisParticipation }} 🪙
        </p>
        <p>
          <strong>Nombre de participants :</strong>
          {{ data.nombreParticipants }}
        </p>
        <p>
          <strong>Montant de la récompense :</strong>
          {{ data.montantRecompense }} 🪙
        </p>
        <p><strong>Type de récompense :</strong> {{ data.typeRecompense }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-button (click)="close()">Fermer</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ChasseDetailsDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ChasseDetailsDialogComponent>);

  close() {
    this.dialogRef.close();
  }
}
