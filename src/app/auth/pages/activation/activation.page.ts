import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-activation',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <p *ngIf="loading">Activation en cours...</p>
      <p *ngIf="success" style="color: green">
        ✅ Activation réussie. Redirection en cours...
      </p>
      <p *ngIf="error" style="color: red">❌ {{ error }}</p>
    </mat-card>
  `,
})
export class ActivationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = true;
  success = false;
  error = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error = 'Token manquant';
      this.loading = false;
      return;
    }

    this.authService.activate(token).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de l’activation';
        this.loading = false;
      },
    });
  }
}
