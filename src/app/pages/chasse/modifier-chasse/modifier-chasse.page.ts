import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChasseService } from '../../../services/chasse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AfterViewInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modifier-chasse',
  templateUrl: './modifier-chasse.page.html',
  styleUrls: ['./modifier-chasse.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class ModifierChassePage implements OnInit, AfterViewInit {
  chasse: any;
  chasseId!: number;
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;

  constructor(
    private route: ActivatedRoute,
    private chasseService: ChasseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chasseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Chasse ID:', this.chasseId);
    this.chasseService.getChasseParId(this.chasseId).subscribe({
      next: (res) => {
        this.chasse = res;
        setTimeout(() => this.initMap(), 100);
      },
      error: () => alert('❌ Erreur chargement chasse.'),
    });
  }

  ngAfterViewInit(): void {}

  private initMap(): void {
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: {
          lat: this.chasse.latitudeCache || 48.8566,
          lng: this.chasse.longitudeCache || 2.3522,
        },
        zoom: 12,
      }
    );

    this.marker = new google.maps.Marker({
      position: {
        lat: this.chasse.latitudeCache || 48.8566,
        lng: this.chasse.longitudeCache || 2.3522,
      },
      map: this.map,
      draggable: true,
      icon: {
        url: 'treasureChest.png',
        scaledSize: new google.maps.Size(40, 40),
      },
    });
    // drag sur la carte
    this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.chasse.latitudeCache = event.latLng.lat();
        this.chasse.longitudeCache = event.latLng.lng();
      }
    });

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.chasse.latitudeCache = event.latLng.lat();
        this.chasse.longitudeCache = event.latLng.lng();
        this.marker.setPosition(event.latLng);
      }
    });
  }

  mettreAJourChasse() {
    this.chasseService.updateChasse(this.chasseId, this.chasse).subscribe({
      next: () => {
        alert('✅ Chasse mise à jour avec succès');
        this.router.navigate(['/chasses/mes']);
      },
      error: () => alert('❌ Échec de mise à jour'),
    });
  }

  ajouterEtape() {
    this.router.navigate(['/etapes/ajouter'], {
      queryParams: { chasseId: this.chasseId },
    });
  }
}
