import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private msalService: MsalService,
    private router: Router,
    private userService: UserService
  ) {}

  logout() {
    this.userService.clearUsuario();
    this.msalService.logoutPopup().subscribe({
      next: () => {
        console.log('Logout success');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }

  esVeterinario(): boolean {
    return this.userService.isVeterinario();
  }
}
