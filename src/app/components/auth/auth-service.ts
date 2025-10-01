import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/LoginResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: LoginResponse | null = null;
  private baseURL = import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8080';

  async login(username: string, password: string) {
    const res = await fetch(`${this.baseURL}/api/v1/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) return false;

    this.currentUser = (await res.json()) as LoginResponse;
    return true;
  }

  getUserId(): number | undefined {
    return this.currentUser?.userId;
  }

  logout() {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
