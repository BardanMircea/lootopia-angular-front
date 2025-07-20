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
  templateUrl: './chasse-details-dialog.component.html',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  template: ``,
})
export class ChasseDetailsDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ChasseDetailsDialogComponent>);

  close() {
    this.dialogRef.close();
  }
}
