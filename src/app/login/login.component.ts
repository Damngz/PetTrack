import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../services/user-api.service';
import { UserService, Usuario } from '../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  title = 'Pet Track';
  isLoggedIn = false;

  constructor(
    private msalService: MsalService,
    private router: Router,
    private usuarioApi: UsuarioApiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const account = this.msalService.instance.getActiveAccount();
    this.isLoggedIn = !!account;

    if (this.isLoggedIn && account?.username) {
      this.obtenerUsuarioYRedirigir(account.username);
    }
  }

  login() {
    this.msalService.loginPopup().subscribe({
      next: (result) => {
        const account = this.msalService.instance.getAllAccounts()[0];
        this.msalService.instance.setActiveAccount(account);
        this.isLoggedIn = true;

        if (account?.username) {
          this.obtenerUsuarioYRedirigir(account.username);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoggedIn = false;
      }
    });
  }

  private obtenerUsuarioYRedirigir(correo: string) {
    this.usuarioApi.getUsuarioPorCorreo(correo).subscribe({
      next: (usuario: Usuario) => {
        console.log(usuario);
        this.userService.setUsuario(usuario);
        this.router.navigate(['/home']);
      },
      error: (err: Error) => {
        console.error('No se pudo obtener el usuario:', err);
      }
    });
  }
}
