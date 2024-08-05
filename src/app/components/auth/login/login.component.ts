import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Auth } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    const authData: Auth = {
      email: form.value.email,
      password: form.value.password,
    };
    this.authService.login(authData);
  }
}
