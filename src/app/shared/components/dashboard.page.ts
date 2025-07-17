import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <h2>Tableau de bord utilisateur</h2>
    </mat-card>
  `,
})
export class DashboardPage {}
