import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ChasseService } from '../../../services/chasse.service';

@Component({
  standalone: true,
  selector: 'app-creer-chasse',
  templateUrl: './creer-chasse.page.html',
  styleUrls: ['./creer-chasse.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class CreerChassePage {
  private chasseService = inject(ChasseService);
  private router = inject(Router);

  description = '';
  latitudeCache = 48.8566;
  longitudeCache = 2.3522;
  typeMonde = 'CARTOGRAPHIQUE';
  messageCacheTrouve = '';
  fraisParticipation = 0;
  typeRecompense = 'COURONNES';
  montantRecompense = 100;
  visibilite = 'PUBLIC';
  titre = '';
  nombreParticipants = null;
  nombreEtapes = 0;
  dateDebut = new Date().toISOString().split('T')[0];
  dateFin = new Date(new Date().setDate(new Date().getDate() + 7))
    .toISOString()
    .split('T')[0];

  ngAfterViewInit() {
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: this.latitudeCache, lng: this.longitudeCache },
        zoom: 12,
      }
    );

    const marker = new google.maps.Marker({
      position: {
        lat: this.latitudeCache || 48.8566,
        lng: this.longitudeCache || 2.3522,
      },
      map: map,
      draggable: true,
      icon: {
        url: 'treasureChest.png',
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.latitudeCache = event.latLng.lat();
        this.longitudeCache = event.latLng.lng();
      }
    });

    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.latitudeCache = event.latLng.lat();
        this.longitudeCache = event.latLng.lng();
        marker.setPosition(event.latLng);
      }
    });
  }

  creerChasse() {
    this.chasseService
      .creerChasse({
        description: this.description,
        latitudeCache: this.latitudeCache,
        longitudeCache: this.longitudeCache,
        monde: this.typeMonde,
        messageCacheTrouve: this.messageCacheTrouve,
        fraisParticipation: this.fraisParticipation,
        typeRecompense: this.typeRecompense,
        montantRecompense: this.montantRecompense,
        visibilite: this.visibilite,
        titre: this.titre,
        dateDebut: this.dateDebut + 'T00:00:00',
        dateFin: this.dateFin + 'T00:00:00',
        nombreParticipants: Number(this.nombreParticipants),
        nombreEtapes: this.nombreEtapes,
      })
      .subscribe(() => {
        alert('✅ Chasse créée avec succès !');
        this.router.navigate(['/chasses/mes']);
      });
  }
}
