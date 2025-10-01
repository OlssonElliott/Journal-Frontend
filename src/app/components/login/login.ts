import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { username: '', password: '' };
  registerData = { username: '', email: '', password: '', confirmPassword: '' };
  error = '';
  loading = false;
  isRegistering = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async submit(form: NgForm) {
    if (this.loading) return;

    this.error = '';
    this.loading = true;
    this.cdr.markForCheck();

    if (this.isRegistering) {
      if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
        this.error = 'Fyll i alla fält för att skapa konto.';
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }

      if (this.registerData.password !== this.registerData.confirmPassword) {
        this.error = 'Lösenorden matchar inte.';
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }

      const created = await this.auth.register({
        username: this.registerData.username.trim(),
        email: this.registerData.email.trim(),
        password: this.registerData.password,
      });

      if (!created) {
        this.error = 'Kunde inte skapa konto.';
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }

      const loggedIn = await this.auth.login(this.registerData.username, this.registerData.password);
      if (loggedIn) {
        await this.router.navigate(['/journal']);
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }

      this.error = 'Kontot skapades men inloggningen misslyckades. Försök logga in.';
      this.loading = false;
      this.isRegistering = false;
      this.credentials = { username: this.registerData.username, password: '' };
      this.registerData = { username: '', email: '', password: '', confirmPassword: '' };
      form.resetForm({ username: this.credentials.username });
      this.cdr.markForCheck();
      return;
    }

    const ok = await this.auth.login(this.credentials.username, this.credentials.password);
    if (ok) {
      await this.router.navigate(['/journal']);
    } else {
      this.error = 'Fel användarnamn eller lösenord.';
    }

    this.loading = false;
    this.cdr.markForCheck();
  }

  toggleMode(form: NgForm) {
    this.isRegistering = !this.isRegistering;
    this.error = '';
    this.loading = false;
    this.credentials = { username: '', password: '' };
    this.registerData = { username: '', email: '', password: '', confirmPassword: '' };
    form.resetForm();
    this.cdr.markForCheck();
  }
}
