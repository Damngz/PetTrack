import { Component } from '@angular/core';
import { Cita, CitaService } from '../services/cita.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { Mascota, MascotaService } from '../services/mascota.service';

@Component({
  selector: 'app-citas',
  imports: [CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent {
  userId: number = 0;
  citas: Cita[] = [];
  isVeterinario: boolean = false;
  citasFormateadas: any[] = [];
  mascotas: Mascota[] = [];
  tab: 'pendientes' | 'todas' = 'pendientes';
  activeTabClasses =
    'inline-block p-4 text-emerald-600 border-b-2 border-emerald-600 rounded-t-lg dark:text-emerald-400';
  inactiveTabClasses =
    'inline-block p-4 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 border-b-2 border-transparent rounded-t-lg dark:text-gray-400 dark:hover:text-emerald-400';

  constructor(
    private citaService: CitaService,
    private userService: UserService,
    private mascotaService: MascotaService
  ) {}

  ngOnInit() {
    const user = this.userService.getUsuario();

    if (user) {
      this.userId = user.id;
      this.isVeterinario = user.rol === 'veterinario';

      if (this.isVeterinario) {
        this.mascotaService.getMascotas().subscribe((m) => (this.mascotas = m));
        this.citaService
          .getCitasPorVeterinario(this.userId)
          .subscribe((citas) => {
            this.citasFormateadas = citas
              .sort((a, b) => {
                const estadoOrden: {[key: string]: number} = {
                  Pendiente: 0,
                  Completada: 1,
                  'No asiste': 2,
                  Cancelada: 3,
                };

                const estadoA = estadoOrden[a.estado] ?? 99;
                const estadoB = estadoOrden[b.estado] ?? 99;

                if (estadoA !== estadoB) {
                  return estadoA - estadoB;
                }

                return (
                  new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                );
              })
              .map((c) => ({
                ...c,
                fechaFormateada: new Date(c.fecha).toLocaleString('es-CL', {
                  timeZone: 'America/Santiago',
                }),
              }));
          });
      }
    }
  }

  nombreMascota(idMascota: number) {
    const mascota = this.mascotas.find((m) => m.id === idMascota);
    if (mascota) {
      return `${mascota.nombre}, ${mascota.especie} - ${mascota.raza}`;
    }
    return 'Desconocida';
  }

  getCitasFiltradas() {
    if (this.tab === 'pendientes') {
      return this.citasFormateadas.filter(c => c.estado === 'Pendiente');
    }
    return this.citasFormateadas;
  }


  modificarCita(
    cita: Cita,
    estadoCita: 'Completada' | 'No asiste' | 'Cancelada'
  ) {
    const citaActualizada = { ...cita, estado: estadoCita };

    this.citaService
      .actualizarCita(cita.idCita as number, citaActualizada)
      .subscribe({
        next: () => {
          alert('Cita actualizada con éxito');
          const index = this.citasFormateadas.findIndex(
            (c) => c.idCita === cita.idCita
          );
          if (index > -1) {
            this.citasFormateadas[index].estado = estadoCita;
          }
        },
        error: (err) => {
          alert(`Error actualizando cita: ${err}`);
        },
      });
  }
}
