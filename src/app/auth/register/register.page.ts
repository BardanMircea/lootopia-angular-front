import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { materialImports } from '../../material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ...materialImports,
  ],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild('rgpdModal') rgpdModal: any;

  ouvrirRgpdModal(event: Event) {
    event.preventDefault();
    this.dialog.open(this.rgpdModal);
  }

  form = this.fb.group({
    pseudo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
      ],
    ],
    rgpdConsent: [false, Validators.requiredTrue], // doit être coché
  });

  loading = false;
  error = '';
  success = false;

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = true;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de l’inscription';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  get mdpErrors() {
    const value = this.form.get('motDePasse')?.value || '';
    return {
      length: value.length < 8,
      upper: !/[A-Z]/.test(value),
      lower: !/[a-z]/.test(value),
      digit: !/\d/.test(value),
      special: !/[\W_]/.test(value),
    };
  }
}
