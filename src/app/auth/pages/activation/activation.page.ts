import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-activation',
  template: `<p>{{ message }}</p>`,
  imports: [CommonModule],
})
export class ActivationPage implements OnInit {
  message = 'Activation en cours...';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.activate(token).subscribe({
        next: () => {
          this.message = 'Compte activé avec succès.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.message = 'Échec de l’activation.';
        },
      });
    } else {
      this.message = 'Lien d’activation invalide.';
    }
  }
}
