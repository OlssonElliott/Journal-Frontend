import { Component } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { username: '', password: '' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    const ok = await this.auth.login(this.credentials.username, this.credentials.password);
    if (ok) {
      this.router.navigate(['/journal']);
    } else {
      this.error = 'Fel användarnamn eller lösenord.';
    }
  }
}
