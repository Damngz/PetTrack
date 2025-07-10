import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  citas = 0;

  constructor(
    private msalService: MsalService,
    private router: Router,
    private userService: UserService,
    private citaService: CitaService
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

  nombreUsuario(): string {
    const user = this.userService.getUsuario();
    const userName = user?.nombre ? `${user.nombre} ${user.apellido}` : '';
    const role = user?.rol
      ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1)
      : '';
    return `${userName} - ${role}`;
  }
}
