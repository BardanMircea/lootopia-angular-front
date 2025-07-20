import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  ParticipationService,
  Participation,
} from '../../services/participation.service';
import { CreusageService } from '../../services/creusage.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  standalone: true,
  selector: 'app-mes-participations',
  templateUrl: './mes-participations.page.html',
  styleUrls: ['./mes-participations.page.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class MesParticipationsPage implements OnInit {
  @ViewChild('mapRef') mapElementRef!: ElementRef;
  private participationService = inject(ParticipationService);
  private creusageService = inject(CreusageService);
  private utilisateurService = inject(UtilisateurService);
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  creusageDebloque: Record<number, boolean> = {};
  selectedMarker: google.maps.Marker | null = null;

  participations: Participation[] = [];
  loading = true;
  soldeUtilisateur = this.utilisateurService.soldeCouronnes();
  readonly coutDeblocage = 20;

  modeCreusage = false;
  currentParticipation: Participation | null = null;
  lat: number = 48.8566;
  lng: number = 2.3522;
  recompense: number = 0;
  dateValidation: Date | null = null;

  successMessages: Record<number, string> = {};
  failedCreusages: Record<number, Date> = {};
  retryCountdowns: Record<number, string> = {};

  ngOnInit(): void {
    this.utilisateurService
      .getUtilisateurConnecte(this.authService.getUserInfo()?.email || '')
      .subscribe({
        next: (u) => (this.soldeUtilisateur = u.soldeCouronnes),
      });
    this.participationService.getMesParticipations().subscribe({
      next: (data) => {
        this.participations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement participations :', err);
        this.loading = false;
      },
    });
    this.loadFailedCreusagesFromLocalStorage();

    // Mise à jour automatique des compte à rebours
    setInterval(() => this.updateCountdowns(), 1000);
  }

  debloquerCreusage(p: Participation) {
    if (this.soldeUtilisateur < this.coutDeblocage) {
      alert("❌ Vous n'avez pas assez de couronnes !");
      return;
    }

    if (
      !confirm(
        `Payer ${this.coutDeblocage} couronnes pour réessayer immédiatement ?`
      )
    )
      return;

    this.transactionService.debloquerCreusage(this.coutDeblocage).subscribe({
      next: (res) => {
        this.utilisateurService.setSoldeDirectement(res.nouveauSolde);
        delete this.failedCreusages[p.id];
        delete this.retryCountdowns[p.id];
        this.creusageDebloque[p.id] = true;
        alert(
          '✅ Déblocage effectué ! Vous pouvez maintenant creuser à nouveau.'
        );
      },
      error: () => {
        alert('❌ Erreur lors du déblocage. Veuillez réessayer.');
      },
    });

    delete this.failedCreusages[p.id];
    delete this.retryCountdowns[p.id];
  }

  annulerParticipation(participation: Participation) {
    if (!confirm(`Annuler la participation à "${participation.titreChasse}" ?`))
      return;

    this.participationService.annulerParticipation(participation.id).subscribe({
      next: () => {
        this.participations = this.participations.filter(
          (p) => p.id !== participation.id
        );
        alert('Participation annulée.');
      },
      error: (err) => {
        console.error('Erreur lors de l’annulation :', err);
        alert(err?.error?.message || 'Erreur lors de l’annulation.');
      },
    });
  }

  initierCreusage(participation: Participation) {
    this.currentParticipation = participation;
    this.modeCreusage = true;
    this.lat = 48.8566;
    this.lng = 2.3522;

    setTimeout(() => {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: this.lat, lng: this.lng },
          zoom: 12,
        }
      );

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          this.lat = e.latLng.lat();
          this.lng = e.latLng.lng();

          // Supprimer l'ancien marker
          if (this.selectedMarker) {
            this.selectedMarker.setMap(null);
          }

          this.selectedMarker = new google.maps.Marker({
            position: { lat: this.lat, lng: this.lng },
            map: map,
            icon: {
              url: 'xspot.png',
              scaledSize: new google.maps.Size(40, 40),
            },
          });
        }
      });
      this.mapElementRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  validerCreusage() {
    if (!this.currentParticipation) return;

    this.creusageService
      .creuser({
        chasseId: this.currentParticipation.chasseId,
        latitude: this.lat,
        longitude: this.lng,
      })
      .subscribe({
        next: (res) => {
          const message = res?.message?.toLowerCase() || '';
          console.log('Réponse creusage :', res);
          this.recompense = res?.gainCouronnes || 0;

          if (res?.success === false) {
            this.failedCreusages[this.currentParticipation!.id] = new Date(
              Date.now() + 24 * 3600 * 1000
            );
            this.modeCreusage = false;
            alert('Creusage incorrect. Réessayez plus tard');
            this.saveFailedCreusagesToLocalStorage();
            return;
          }

          // Succès réel
          this.successMessages[this.currentParticipation!.id] =
            res?.message || 'Cache trouvé ! Récompense ajoutée.';
          this.modeCreusage = false;
          this.utilisateurService.mettreAJourSolde(
            this.authService.getUserInfo()?.email || ''
          );
        },
        error: () => {
          // Cas d’erreur réelle (timeout, 500, etc.)
          this.failedCreusages[this.currentParticipation!.id] = new Date(
            Date.now() + 24 * 3600 * 1000
          );
          this.modeCreusage = false;
          this.saveFailedCreusagesToLocalStorage();
          alert('Erreur lors du creusage. Réessayez plus tard.');
        },
      });
  }

  updateCountdowns() {
    const now = new Date().getTime();
    Object.entries(this.failedCreusages).forEach(([id, until]) => {
      const remaining = new Date(until).getTime() - now;
      if (remaining <= 0) {
        delete this.failedCreusages[+id];
        delete this.retryCountdowns[+id];
        this.saveFailedCreusagesToLocalStorage();
      } else {
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        this.retryCountdowns[+id] = `${hrs}h ${mins}m ${secs}s`;
      }
    });
  }

  canRetry(participationId: number): boolean {
    return !this.failedCreusages[participationId];
  }

  private saveFailedCreusagesToLocalStorage() {
    const data: Record<number, string> = {};
    for (const [key, date] of Object.entries(this.failedCreusages)) {
      data[+key] = new Date(date).toISOString();
    }
    localStorage.setItem('failedCreusages', JSON.stringify(data));
  }
  private loadFailedCreusagesFromLocalStorage() {
    const raw = localStorage.getItem('failedCreusages');
    if (!raw) return;

    try {
      const parsed: Record<number, string> = JSON.parse(raw);
      for (const [id, isoString] of Object.entries(parsed)) {
        const retryDate = new Date(isoString);
        if (retryDate.getTime() > Date.now()) {
          this.failedCreusages[+id] = retryDate;
        }
      }
    } catch (e) {
      console.error('Erreur parsing failedCreusages localStorage', e);
    }
  }
}
