import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Utilisateur {
  id: number;
  pseudo: string;
  email: string;
  dateInscription: Date;
  isPartenaire: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = '/admin';

  constructor(private http: HttpClient) {}

  supprimerUtilisateur(id: number) {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }

  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/users`);
  }
}
