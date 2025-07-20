import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/auth';

  constructor(private http: HttpClient) {}

  getUserRole(): string {
    const role = localStorage.getItem('userRole');
    return role ? JSON.parse(role) : '';
  }

  login(
    data: Partial<{ email: string | null; motDePasse: string | null }>
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('jwt', res.token);
        const userInfo = this.getUserInfo();
        if (userInfo && userInfo.roles) {
          localStorage.setItem('userRole', JSON.stringify(userInfo.roles));
        }
        console.log(this.getUserInfo()?.roles);
        console.log(
          'User role set in localStorage:',
          localStorage.getItem('userRole')
        );
        console.log(
          'JWT token set in localStorage:',
          localStorage.getItem('jwt')
        );
      })
    );
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
    localStorage.removeItem('userRole');
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
