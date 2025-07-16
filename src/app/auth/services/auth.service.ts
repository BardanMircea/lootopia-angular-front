import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(
    data: Partial<{ email: string | null; motDePasse: string | null }>
  ): Observable<any> {
    console.log('Login data:', data);
    return this.http
      .post(`${this.apiUrl}/login`, data)
      .pipe(tap((res: any) => localStorage.setItem('jwt', res.token)));
  }

  register(
    data: Partial<{
      email: string | null;
      password: string | null;
      nickname: string | null;
    }>
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  activate(token: string | null | undefined): Observable<any> {
    return this.http.get(`${this.apiUrl}/activate?token=${token}`);
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
