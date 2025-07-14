import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  HistorialMedicoService,
  HistorialMedico,
} from '../services/historial.service';
import { Mascota, MascotaService } from '../services/mascota.service';
import { Vacuna, VacunaService } from '../services/vacuna.service';
import { UserService, Usuario } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CrearCitaComponent } from '../crear-cita/crear-cita.component';
import { UsuarioApiService } from '../services/user-api.service';
import { Cita, CitaService } from '../services/cita.service';

@Component({
  selector: 'app-mascota-detalle',
  imports: [CommonModule, FormsModule, CrearCitaComponent, QRCodeComponent],
  templateUrl: './mascota-detalle.component.html',
  styleUrls: ['./mascota-detalle.component.css'],
})
export class MascotaDetalleComponent implements OnInit {
  @ViewChild('carnetRef', { static: false }) carnetRef!: ElementRef;
  idMascota!: number;
  historial: HistorialMedico[] = [];
  mascota: Partial<Mascota> = {};
  tab: 'historial' | 'vacunas' | 'citas' = 'historial';
  activeTabClasses =
    'inline-block p-4 text-emerald-600 border-b-2 border-emerald-600 rounded-t-lg dark:text-emerald-400';
  inactiveTabClasses =
    'inline-block p-4 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 border-b-2 border-transparent rounded-t-lg dark:text-gray-400 dark:hover:text-emerald-400';
  vacunas: Vacuna[] = [];
  mostrarFormularioAtencion = false;
  mostrarFormularioVacuna = false;
  mostrarFormularioCita = false;
  nuevaAtencion: Partial<HistorialMedico> = {};
  nuevaVacuna: Partial<Vacuna> = {};
  mostrarFormularioEdicion = false;
  user: Partial<Usuario> = {};
  tutor: Partial<Usuario> = {};
  citas: Cita[] = [];
  veterinarios: Usuario[] = [];
  carnetGenerado = false;
  qrText = '';
  vencimiento: string = '';

  constructor(
    private route: ActivatedRoute,
    private historialService: HistorialMedicoService,
    private mascotaService: MascotaService,
    private vacunaService: VacunaService,
    private userService: UserService,
    private userAPIService: UsuarioApiService,
    private citaService: CitaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const mascotaId = +this.route.snapshot.paramMap.get('id')!;
    this.idMascota = mascotaId;
    this.user = this.userService.getUsuario() as Usuario;
    const hoy = new Date();
    const vencimiento = new Date(hoy.setMonth(hoy.getMonth() + 6));
    this.vencimiento = vencimiento.toLocaleDateString('es-ES');
    this.mascotaService.getMascotaById(mascotaId).subscribe((m) => {
      this.mascota = m;
      this.userAPIService
        .getUsuarioPorId(this.mascota.idUsuario as number)
        .subscribe((t) => {
          this.tutor = t;
        });
    });
    this.historialService.getByMascotaId(mascotaId).subscribe((h) => {
      this.historial = h;
    });
    this.vacunaService.getByMascota(mascotaId).subscribe((v) => {
      this.vacunas = v;
    });
    this.citaService.getCitasPorMascota(mascotaId).subscribe((c) => {
      this.citas = c.sort((a, b) => {
        const estadoOrden: { [key: string]: number } = {
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

        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });
    });
    this.userAPIService.getUsuariosVeterinarios().subscribe((v) => {
      this.veterinarios = v;
    });
  }

  async generarCarnet() {
    const objectToQR = {
      nombre: this.mascota.nombre,
      fechaNacimiento: this.mascota.fechaNacimiento,
      especie: this.mascota.especie,
      raza: this.mascota.raza,
      sexo: this.mascota.sexo,
      tutor: this.tutor.rut,
      vacunas: this.vacunas.length > 0 ? this.vacunas.map((vacuna) => { return { nombre: vacuna.nombre, fecha: vacuna.fechaAplicacion }}) : 'No tiene vacunas registradas.',
    };
    const request = await fetch('https://zd4wd5lwmca2tm3fkr47e2kkuy0dpvld.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      body: JSON.stringify(objectToQR)
    });
    const response = await request.json();

    this.qrText = response.qrUrl;
    this.carnetGenerado = true;
  }

  generarPDF() {
    const carnetElement = this.carnetRef.nativeElement;

    html2canvas(carnetElement, {
      scale: 4,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(this.mascota.nombre?.toLowerCase()+'-carnet.pdf');
    });
  }

  isVeterinario() {
    return this.user.rol === 'veterinario';
  }

  editarMascota() {
    this.mascotaService.updateMascota(this.mascota).subscribe(() => {
      alert('Mascota actualizada correctamente');
      this.mostrarFormularioEdicion = false;
    });
  }

  volverAMascotas() {
    this.router.navigate(['/mascotas']);
  }

  eliminarMascota() {
    const del = confirm('¿Desea eliminar esta mascota?');
    if (del) {
      this.mascotaService
        .deleteMascota(this.mascota.id as number)
        .subscribe(() => {
          alert('Mascota eliminada correctamente');
          this.router.navigate(['/mascotas']);
        });
    }
  }

  nombreTutor(): string {
    return this.tutor
      ? `${this.tutor.nombre} ${this.tutor.apellido} (${this.tutor.rut})`
      : 'Desconocido';
  }

  nombreVeterinario(id: number): string {
    const veterinario = this.veterinarios.find((u) => u.id === id);
    return veterinario
      ? `${veterinario.nombre} ${veterinario.apellido} (${veterinario.rut})`
      : 'Desconocido';
  }

  agregarAtencion() {
    const nueva = {
      ...this.nuevaAtencion,
      idMascota: this.idMascota,
      idUsuario: this.user.id,
      fecha: new Date().toLocaleDateString('en-CA'),
    };
    this.historialService
      .createAtencion(nueva as HistorialMedico)
      .subscribe(() => {
        alert('Atención médica ingresada correctamente');
        this.historial.push(nueva as HistorialMedico);
        this.mostrarFormularioAtencion = false;
      });
  }

  agregarVacuna() {
    const nueva = {
      ...this.nuevaVacuna,
      fechaAplicacion: new Date().toLocaleDateString('en-CA'),
      idMascota: this.idMascota,
      idUsuario: this.user.id,
    };
    this.vacunaService.createVacuna(nueva as Vacuna).subscribe(() => {
      alert('Vacuna administrada correctamente');
      this.vacunas.push(nueva as Vacuna);
      this.mostrarFormularioVacuna = false;
    });
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
          const index = this.citas.findIndex(
            (c) => c.idCita === cita.idCita
          );
          if (index > -1) {
            this.citas[index].estado = estadoCita;
          }
        },
        error: (err) => {
          alert(`Error actualizando cita: ${err}`);
        },
      });
  }

  eliminarCita(cita: Cita) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

    this.citaService.eliminarCita(cita.idCita as number).subscribe({
      next: () => {
        this.citas = this.citas.filter(c => c.idCita !== cita.idCita);
        alert('Cita eliminada correctamente.');
      },
      error: err => {
        alert('Error al eliminar la cita: ' + err.message);
      }
    });
  }
}
