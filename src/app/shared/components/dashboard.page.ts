import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <h2>Tableau de bord utilisateur</h2>
      <p>Cette page est protégée par un guard.</p>
    </mat-card>
  `,
})
export class DashboardPage {}
