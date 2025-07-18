import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/auth';

  constructor(private http: HttpClient) {}

  login(
    data: Partial<{ email: string | null; motDePasse: string | null }>
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, data)
      .pipe(tap((res: any) => localStorage.setItem('jwt', res.token)));
  }

  register(
    data: Partial<{
      email: string | null;
      motDePasse: string | null;
      pseudo: string | null;
    }>
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  activate(token: string | null | undefined): Observable<any> {
    return this.http.get(`${this.apiUrl}/activate?token=${token}`);
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('failedCreusages');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserInfo(): { email?: string; roles?: string[]; pseudo: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        roles: payload.roles || [],
        pseudo: payload.pseudo || '',
      };
    } catch (e) {
      return null;
    }
  }
}
