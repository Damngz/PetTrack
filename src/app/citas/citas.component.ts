import { Component } from '@angular/core';
import { Cita, CitaService } from '../services/cita.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citas',
  imports: [CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent {
  userId: number = 0;
  citas: Cita[] = [];
  isVeterinario: boolean = false;
  citasFormateadas: any[] = [];

  constructor(private citaService: CitaService, private userService: UserService) {}

  ngOnInit() {
    const user = this.userService.getUsuario();

    if (user) {
      this.userId = user.id;
      this.isVeterinario = user.rol === 'veterinario';

      if (this.isVeterinario) {
        this.citaService.getCitasPorVeterinario(this.userId).subscribe((citas) => {
          this.citasFormateadas = citas.map(c => ({
            ...c,
            fechaFormateada: new Date(c.fecha).toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
          }));
        });
      }
    }
  }
}
