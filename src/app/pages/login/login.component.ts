import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) { }

  async login(): Promise<void> {
    try {
      await this.authService.login(this.email, this.password);
      // The service will handle navigation on success.
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
}
