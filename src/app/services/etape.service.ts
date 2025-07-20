import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EtapeCreationDto {
  chasseId?: number;
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
  private apiUrl = '/etapes';

  constructor(private http: HttpClient) {}

  creerEtape(etape: EtapeCreationDto): Observable<any> {
    console.log('Création de l’étape:', etape);
    return this.http.post(`${this.apiUrl}`, etape);
  }
}
