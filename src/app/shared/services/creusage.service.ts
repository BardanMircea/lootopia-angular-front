import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Creusage {
  chasseId: number;
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class CreusageService {
  private apiUrl = '/creusages';

  constructor(private http: HttpClient) {}

  creuser(creusage: Creusage): Observable<any> {
    return this.http.post(`${this.apiUrl}`, creusage);
  }
}
