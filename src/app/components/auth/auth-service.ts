import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/LoginResponse';

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: LoginResponse | null = null;
  private baseURL = import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8080';

  async login(username: string, password: string) {
    try {
      const res = await fetch(`${this.baseURL}/api/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      this.currentUser = (await res.json()) as LoginResponse;
      return true;
    } catch {
      return false;
    }
  }

  async register(payload: RegisterPayload): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseURL}/api/v1/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return false;

      await res.json();
      return true;
    } catch {
      return false;
    }
  }

  getUserId(): string | undefined {
    return this.currentUser?.userId;
  }

  logout() {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
