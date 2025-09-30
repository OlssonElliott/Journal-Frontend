import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private baseURL = import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8080';

  async login(username: string, password: string) {
    const res = await fetch(`${this.baseURL}/api/v1/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    this.loggedIn = res.ok;
    return this.loggedIn;
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
