import { Component, Input, OnInit } from '@angular/core';
import { Cita, CitaService } from '../services/cita.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioApiService } from '../services/user-api.service';
import { Usuario } from '../services/user.service';
import {
  HorarioAtencion,
  HorarioAtencionService,
} from '../services/horario.service';

@Component({
  selector: 'app-crear-cita',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './crear-cita.component.html',
  styleUrl: './crear-cita.component.css',
})
export class CrearCitaComponent implements OnInit {
  @Input() idMascota!: number;

  fechaSeleccionada: Date | null = null;
  horaSeleccionada: string = '';
  horasDisponibles: string[] = [];
  horasOcupadas: string[] = [];
  vets: Usuario[] = [];
  motivo: string = '';
  idVeterinarioSeleccionado: number | null = null;
  minDate = new Date();
  horariosVet: HorarioAtencion[] = [];

  constructor(
    private citaService: CitaService,
    private dateAdapter: DateAdapter<Date>,
    private userAPIService: UsuarioApiService,
    private horarioService: HorarioAtencionService
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.userAPIService
      .getUsuariosVeterinarios()
      .subscribe((v) => (this.vets = v));
  }

  onVeterinarioChange(id: number) {
    this.idVeterinarioSeleccionado = id;
    this.horariosVet = [];

    this.horarioService.getHorariosUsuario(id).subscribe((horarios) => {
      this.horariosVet = horarios.map((h: HorarioAtencion) => h);
    });
  }

  generarHorasPorDia(dia: string) {
    this.horasDisponibles = [];

    const horarioDelDia = this.horariosVet.find(
      (h) => h.diaSemana.toUpperCase() === dia.toUpperCase()
    );

    if (!horarioDelDia) return;

    const [inicioH, inicioM] = horarioDelDia.horaInicio.split(':').map(Number);
    const [finH, finM] = horarioDelDia.horaFin.split(':').map(Number);

    let current = new Date();
    current.setHours(inicioH, inicioM, 0, 0);

    const fin = new Date();
    fin.setHours(finH, finM, 0, 0);

    while (current < fin) {
      const hh = current.getHours().toString().padStart(2, '0');
      const mm = current.getMinutes().toString().padStart(2, '0');
      this.horasDisponibles.push(`${hh}:${mm}`);
      current.setMinutes(current.getMinutes() + 30);
    }
  }

  onFechaChange(date: Date | null) {
    this.fechaSeleccionada = date;
    this.horasOcupadas = [];
    this.horasDisponibles = [];

    if (!date) return;

    const diasSemana: string[] = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO',
    ];
    const diaTexto = diasSemana[date.getDay()];

    this.generarHorasPorDia(diaTexto); // 💡 Filtra horas según el día

    this.citaService
      .getCitasPorVeterinario(this.idVeterinarioSeleccionado as number)
      .subscribe((citas) => {
        const citasDelDia = citas.filter((cita) => {
          const citaDate = new Date(cita.fecha);
          return (
            citaDate.getFullYear() === date.getFullYear() &&
            citaDate.getMonth() === date.getMonth() &&
            citaDate.getDate() === date.getDate()
          );
        });

        this.horasOcupadas = citasDelDia.map((c) => {
          const d = new Date(c.fecha);
          return d.toTimeString().substring(0, 5);
        });
      });
  }

  guardarCita() {
    if (!this.fechaSeleccionada || !this.horaSeleccionada || !this.motivo)
      return;

    const [hora, minuto] = this.horaSeleccionada.split(':').map(Number);
    const fechaFinal = new Date(this.fechaSeleccionada);
    fechaFinal.setHours(hora, minuto, 0, 0);
    const year = fechaFinal.getFullYear();
    const month = (fechaFinal.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaFinal.getDate().toString().padStart(2, '0');
    const selectedHour = hora.toString().padStart(2, '0');
    const selectedMinute = minuto.toString().padStart(2, '0');
    const fechaParaGuardar = `${year}-${month}-${day}T${selectedHour}:${selectedMinute}:00`;

    const cita: Cita = {
      idMascota: this.idMascota,
      idUsuario: this.idVeterinarioSeleccionado as number,
      fecha: fechaParaGuardar,
      motivo: this.motivo,
      estado: 'Pendiente',
    };

    this.citaService.crearCita(cita).subscribe(() => {
      alert('Cita creada exitosamente');
      this.fechaSeleccionada = null;
      this.horaSeleccionada = '';
      this.motivo = '';
      this.idVeterinarioSeleccionado = null;
    });
  }

  deshabilitarFecha = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!d || !this.horariosVet.length) return false;
    if (d < today) return false;

    const diasSemana: string[] = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO',
    ];

    const diaTexto = diasSemana[d.getDay()];

    return this.horariosVet.some((h) => h.diaSemana === diaTexto);
  };

  horaBloqueada(hora: string): boolean {
    return this.horasOcupadas.includes(hora);
  }
}
