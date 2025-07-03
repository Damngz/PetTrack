import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pet Track';
  constructor(private userService: UserService) {
    // Fuerza la carga del usuario desde localStorage al iniciar
    this.userService.getUsuario();
  }
}
