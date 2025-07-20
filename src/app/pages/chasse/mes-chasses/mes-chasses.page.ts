import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChasseService,
  NouvelleChasse,
} from '../../../services/chasse.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mes-chasses',
  templateUrl: './mes-chasses.page.html',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
})
export class MesChassesPage implements OnInit {
  private chasseService = inject(ChasseService);
  chasses: NouvelleChasse[] = [];

  ngOnInit(): void {
    this.chasseService.getChassesOrganisateur().subscribe({
      next: (data) => (this.chasses = data),
    });
  }
}
