import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chasse {
  id: number;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  monde: string;
  visibilite: boolean;
  createur: string;
  nombreParticipants: number;
  nombreEtapes: number;
  montantRecompense: number;
  dejaInscrit?: boolean;
  fraisParticipation: number;
}

export interface NouvelleChasse {
  titre: string;
  description?: string;
  latitudeCache: number;
  longitudeCache: number;
  dateDebut: string;
  dateFin: string;
  monde: string;
  visibilite: string;
  nombreParticipants: number;
  nombreEtapes: number;
  typeRecompense: string;
  montantRecompense: number;
  fraisParticipation: number;
  messageCacheTrouve: string;
}

@Injectable({ providedIn: 'root' })
export class ChasseService {
  private apiUrl = '/chasses';

  constructor(private http: HttpClient) {}

  getChassesOrganisateur(): Observable<NouvelleChasse[]> {
    return this.http.get<NouvelleChasse[]>(`${this.apiUrl}/mes-chasses`, {});
  }

  creerChasse(chasse: NouvelleChasse): Observable<Chasse> {
    return this.http.post<Chasse>(`${this.apiUrl}`, chasse);
  }

  getChassesPubliques(
    page: number = 0,
    size: number = 5
  ): Observable<{
    content: Chasse[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> {
    return this.http.get<{
      content: Chasse[];
      totalElements: number;
      totalPages: number;
      number: number;
    }>(`${this.apiUrl}/public?page=${page}&size=${size}`);
  }

  getChasseById(id: number): Observable<Chasse> {
    return this.http.get<Chasse>(`${this.apiUrl}/${id}`);
  }
}
