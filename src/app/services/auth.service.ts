import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Auth } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user';
  private authStatus = new Subject<boolean>();
  private token: string;
  private expiry: NodeJS.Timeout;
  private authenticated: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  signup(authData: Auth) {
    this.http
      .post(`${this.apiUrl}`, authData)
      .subscribe((res) => console.log(res));
  }

  login(authData: Auth) {
    this.http
      .post<{ token: string; expiresIn: number }>(`${this.apiUrl}`, authData)
      .subscribe((res) => {
        this.token = res.token;
        if (this.token) {
          this.setAuthTimer(res.expiresIn);
          this.authenticated = true;
          this.authStatus.next(this.authenticated);
          const expiry = new Date(new Date().getTime() + res.expiresIn * 1000);
          this.saveAuthData(res.token, expiry);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.authenticated = false;
    this.authStatus.next(this.authenticated);
    clearTimeout(this.expiry);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoLogin() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const expiry = new Date(authData.expiry).getTime() - new Date().getTime();
    if (expiry > 0) {
      this.token = authData.token;
      this.authenticated = true;
      this.setAuthTimer(expiry / 1000);
      this.authStatus.next(this.authenticated);
    }
  }

  private setAuthTimer(duration: number) {
    this.expiry = setTimeout(() => this.logout(), duration * 1000);
  }

  private saveAuthData(token: string, expiry: Date) {
    localStorage.setItem(
      'authData',
      JSON.stringify({ token: token, expiry: expiry.toISOString() })
    );
  }

  private getAuthData() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData) {
      return;
    }
    return { ...authData, expiry: new Date(authData.expiry) };
  }

  private clearAuthData() {
    localStorage.removeItem('authData');
  }
}
