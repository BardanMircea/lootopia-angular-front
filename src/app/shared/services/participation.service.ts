import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Participation {
  id: number;
  chasseId: number;
  titreChasse: string;
  participants: string[];
  inscritDepuis: Date;
  etapeCourante: number;
  eligibleCreusage: boolean;
}

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private apiUrl = '/participations';

  constructor(private http: HttpClient) {}

  participer(chasseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      chasseId: chasseId,
    });
  }

  getMesParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>('/participations');
  }
}
