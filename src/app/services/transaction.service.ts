import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  nouveauSolde: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = '/transactions';

  constructor(private http: HttpClient) {}

  debloquerCreusage(cout: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/debloquer-creusage`, {
      cout: JSON.stringify(cout),
    });
  }
}
