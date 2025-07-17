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
}

@Injectable({ providedIn: 'root' })
export class ChasseService {
  private apiUrl = '/chasses';

  constructor(private http: HttpClient) {
    console.log('✅ ChasseService initialized');
  }

  getChassesPubliques(): Observable<Chasse[]> {
    return this.http.get<Chasse[]>(`${this.apiUrl}/public`);
  }

  getChasseById(id: number): Observable<Chasse> {
    return this.http.get<Chasse>(`${this.apiUrl}/${id}`);
  }
}
