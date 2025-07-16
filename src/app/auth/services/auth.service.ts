import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((res: any) => localStorage.setItem('jwt', res.token)));
  }

  register(email: string, password: string, nickname: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      password,
      nickname,
    });
  }

  activate(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activate`, { token });
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
