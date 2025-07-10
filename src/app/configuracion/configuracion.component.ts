import { Component, OnInit } from '@angular/core';
import { HorarioAtencion, HorarioAtencionService } from '../services/horario.service';
import { UserService, Usuario } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {
  user: Partial<Usuario> = {};

  dias: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  horarios: { [dia: string]: { habilitado: boolean; horaInicio: string; horaFin: string } } = {};

  constructor(private horarioService: HorarioAtencionService, private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUsuario() as Usuario;
    this.dias.forEach(d => {
      this.horarios[d] = { habilitado: false, horaInicio: '09:00', horaFin: '18:00' };
    });

    this.horarioService.getHorariosUsuario(this.user.id as number).subscribe(data => {
      data.forEach(h => {
        this.horarios[h.diaSemana] = {
          habilitado: true,
          horaInicio: h.horaInicio,
          horaFin: h.horaFin,
        };
      });
    });
  }

  guardar() {
    const seleccionados: HorarioAtencion[] = [];

    for (const dia of this.dias) {
      const h = this.horarios[dia];
      if (h.habilitado) {
        seleccionados.push({
          idUsuario: this.user.id as number,
          diaSemana: dia,
          horaInicio: h.horaInicio,
          horaFin: h.horaFin,
        });
      }
    }

    this.horarioService.guardarHorarios(seleccionados).subscribe(() => {
      alert('Horario actualizado correctamente');
    });
  }
}
