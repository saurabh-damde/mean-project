import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Auth } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    const authData: Auth = {
      email: form.value.email,
      password: form.value.password,
    };
    this.authService.signup(authData);
  }
}
