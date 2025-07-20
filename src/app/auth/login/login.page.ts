import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { materialImports } from '../../material';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, ...materialImports],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private utilisateurService = inject(UtilisateurService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]],
  });
  loading = false;
  error = '';

  submit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, motDePasse } = this.loginForm.value;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
        console.log('Token stocké :', res.token);
        this.utilisateurService.mettreAJourSolde(
          this.authService.getUserInfo()?.email || ''
        );
      },
      error: (err) => {
        this.error = err.error?.message || 'Identifiants invalides';
        this.loginForm.reset();
        this.loading = false;
      },
    });
  }
}
