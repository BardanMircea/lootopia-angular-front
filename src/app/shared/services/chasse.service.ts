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

@Injectable({ providedIn: 'root' })
export class ChasseService {
  private apiUrl = '/chasses';

  constructor(private http: HttpClient) {}

  participer(chasseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/participations`, {
      chasseId: chasseId,
    });
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
