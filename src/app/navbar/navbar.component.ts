import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UserService, Usuario } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  citas = 0;
  dropdown = 'hidden';
  user: Partial<Usuario> = {};

  constructor(
    private msalService: MsalService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUsuario() as Usuario;
  }

  logout() {
    this.userService.clearUsuario();
    this.msalService.logoutPopup().subscribe({
      next: () => {
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

  toggleDropdown() {
    this.dropdown = this.dropdown === 'flex' ? 'hidden' : 'flex';
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
