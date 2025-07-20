import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = () => this.auth.isLoggedIn();

  ngOnInit() {
    if (this.auth.isLoggedIn() && this.auth.getUserRole() !== 'ADMIN') {
      this.router.navigate(['/chasses-publiques']);
    } else if (this.auth.isLoggedIn() && this.auth.getUserRole() === 'ADMIN') {
      this.router.navigate(['/admin/utilisateurs']);
    }
  }
}
