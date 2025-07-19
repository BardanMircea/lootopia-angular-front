import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EtapeCreationDto {
  ordre: number;
  consigne: string;
  typeValidation: 'PASSPHRASE' | 'CACHE' | 'REPERE';
  passphrase?: string;
  prixValidationDirecte: number;
  latitudeCache?: number;
  longitudeCache?: number;
  repereRa?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EtapeService {
  private apiUrl = 'etapes';

  constructor(private http: HttpClient) {}

  creerEtape(chasseId: number, etape: EtapeCreationDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/chasse/${chasseId}`, etape);
  }
}
