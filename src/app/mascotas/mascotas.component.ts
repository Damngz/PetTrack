import { Component, OnInit } from '@angular/core';
import { Mascota, MascotaService } from '../services/mascota.service';
import { CommonModule } from '@angular/common';
import { UserService, Usuario } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../services/user-api.service';

@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, FormsModule],
  templateUrl: './mascotas.component.html',
  styleUrl: './mascotas.component.css',
})
export class MascotasComponent implements OnInit {
  mascotas: Mascota[] = [];
  userId!: number;
  isVeterinario: boolean = false;
  searchTerm: string = '';
  mostrarFormulario: boolean = false;
  nuevaMascota: Partial<Mascota> = {};
  usuarios: Usuario[] = [];

  constructor(
    private mascotasService: MascotaService,
    private userService: UserService,
    private router: Router,
    private userApiAservice: UsuarioApiService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUsuario();

    if (user) {
      this.userId = user.id;
      this.isVeterinario = user.rol === 'veterinario';

      if (this.isVeterinario) {
        this.mascotasService
          .getMascotas()
          .subscribe((m) => (this.mascotas = m));
        this.userApiAservice
          .getUsuariosTutores()
          .subscribe((u) => (this.usuarios = u));
      } else {
        this.mascotasService
          .getByUsuario(this.userId)
          .subscribe((m) => (this.mascotas = m));
      }
    }
  }

  goToDetalle(id: number) {
    this.router.navigate(['/mascotas', id]);
  }

  filteredMascotas(): Mascota[] {
    if (!this.searchTerm) {
      return this.mascotas;
    }
    const term = this.searchTerm.toLowerCase();
    return this.mascotas.filter(
      (m) =>
        m.nombre.toLowerCase().includes(term) ||
        m.especie.toLowerCase().includes(term) ||
        m.raza.toLowerCase().includes(term) ||
        m.sexo.toLowerCase().includes(term)
    );
  }

  toggleFormulario() {
    this.mostrarFormulario = true;
  }

  agregarMascota() {
    const mascotaAEnviar = {
      ...this.nuevaMascota,
      idUsuario: parseInt(this.nuevaMascota.idUsuario as unknown as string)
    };

    this.mascotasService.createMascota(mascotaAEnviar).subscribe(m => {
      this.mascotas.push(m);
      this.mostrarFormulario = false;
      this.nuevaMascota = {
        nombre: '',
        especie: '',
        raza: '',
        sexo: '',
        fechaNacimiento: '',
        idUsuario: 0
      };
    });
  }
}
