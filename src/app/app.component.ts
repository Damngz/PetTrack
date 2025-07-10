import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { NavbarComponent } from './navbar/navbar.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pet Track';
  mostrarNavbar = true;

  constructor(private userService: UserService, public router: Router) {
    this.userService.getUsuario();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.mostrarNavbar = event.url !== '/login' && event.url !== '/';
      });
  }
}
