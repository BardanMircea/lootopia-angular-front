import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-activation',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="token" placeholder="Token d'activation" />
      <button type="submit">Activer</button>
      <p *ngIf="error">{{ error }}</p>
      <p *ngIf="success">Activation réussie !</p>
    </form>
  `,
})
export class ActivationPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    token: ['', Validators.required],
  });

  error = '';
  success = false;

  submit() {
    if (this.form.invalid) return;

    this.authService.activate(this.form.value.token).subscribe({
      next: () => {
        this.success = true;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Activation échouée';
      },
    });
  }
}
