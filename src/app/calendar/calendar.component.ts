import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita, CitaService } from '../services/cita.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  citas: Cita[] = [];

  constructor(
    private citasService: CitaService,
    private userService: UserService
  ) {}

  diasMes: (Date | null)[] = [];
  citasPorDia: { [key: string]: number } = {};

  ngOnInit(): void {
    const idVet = this.userService.getUsuario()?.id as number;
    this.citasService.getCitasPorVeterinario(idVet).subscribe((c) => {
      this.citas = c;
      this.generarCalendario(new Date().getFullYear(), new Date().getMonth());
      this.contarCitasPorDia();
    });
  }

  generarCalendario(año: number, mes: number) {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const inicioSemana = primerDia.getDay();

    this.diasMes = [];

    for (let i = 0; i < inicioSemana; i++) {
      this.diasMes.push(null);
    }

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      this.diasMes.push(new Date(año, mes, d));
    }

    while (this.diasMes.length % 7 !== 0) {
      this.diasMes.push(null);
    }
  }

  contarCitasPorDia() {
    this.citasPorDia = {};
    this.citas.forEach((cita) => {
      const fecha = new Date(cita.fecha).toISOString().slice(0, 10);
      this.citasPorDia[fecha] = (this.citasPorDia[fecha] || 0) + 1;
    });
  }

  esHoy(dia: Date | null): boolean {
    if (!dia) return false;
    const hoy = new Date();
    return (
      dia.getDate() === hoy.getDate() &&
      dia.getMonth() === hoy.getMonth() &&
      dia.getFullYear() === hoy.getFullYear()
    );
  }

  citasParaFecha(fecha: Date): number {
    const iso = fecha.toISOString().slice(0, 10);
    return this.citasPorDia[iso] || 0;
  }
}
