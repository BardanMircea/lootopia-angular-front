import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Utilisateur {
  id: number;
  pseudo: string;
  soldeCouronnes: number;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private apiUrl = '/utilisateurs';

  soldeCouronnes = signal<number>(0);

  constructor(private http: HttpClient) {}

  getUtilisateurConnecte(email: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/by-email`, {
      params: { email },
    });
  }

  mettreAJourSolde(email: string) {
    this.getUtilisateurConnecte(email).subscribe({
      next: (u) => this.soldeCouronnes.set(u.soldeCouronnes),
      error: () => this.soldeCouronnes.set(0),
    });
  }

  setSoldeDirectement(nouveauSolde: number) {
    this.soldeCouronnes.set(nouveauSolde);
  }
}
