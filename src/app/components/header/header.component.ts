import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  authenticated: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authenticated = this.authService.isAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatus()
      .subscribe((authenticated) => (this.authenticated = authenticated));
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
