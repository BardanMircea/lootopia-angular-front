import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule],
})
export class RegisterPage {
  email = '';
  password = '';
  nickname = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService
      .register(this.email, this.password, this.nickname)
      .subscribe({
        next: () => (this.success = 'Un email d’activation a été envoyé.'),
        error: (err) =>
          (this.error = err.error?.message || 'Erreur lors de l’inscription'),
      });
  }
}
