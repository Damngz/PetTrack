import { Component } from '@angular/core';
import { UserService, Usuario } from '../services/user.service';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../services/user-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tutores',
  imports: [CommonModule, FormsModule],
  templateUrl: './tutores.component.html',
  styleUrl: './tutores.component.css'
})
export class TutoresComponent {
  tutores: Usuario[] = [];
  searchTerm: string = '';
  nuevoTutor: Partial<Usuario> = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: 'usuario',
    rut: ''
  };
  mostrarFormulario: Boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private userApiAservice: UsuarioApiService
  ) {}

  ngOnInit(): void {
    this.userApiAservice
      .getUsuariosTutores()
      .subscribe((u) => (this.tutores = u));
  }

  filteredTutores(): Usuario[] {
    if (!this.searchTerm) {
      return this.tutores;
    }
    const term = this.searchTerm.toLowerCase();
    return this.tutores.filter(
      (m) =>
        m.nombre.toLowerCase().includes(term) ||
        m.apellido.toLowerCase().includes(term) ||
        m.rut.toLowerCase().includes(term) ||
        m.direccion.toLowerCase().includes(term) ||
        m.telefono.toLowerCase().includes(term)
    );
  }

  goToDetalle(id: number) {
    this.router.navigate(['/tutores', id]);
  }

  toggleFormulario() {
    this.mostrarFormulario = true;
  }

  agregarTutor() {
    const correo = this.nuevoTutor.correo?.toLowerCase();
    const rut = this.nuevoTutor.rut?.replaceAll('.', '').toUpperCase();

    this.userApiAservice.createTutor({
      ...this.nuevoTutor,
      correo,
      rut
    }).subscribe(m => {
      this.tutores.push(m);
      this.mostrarFormulario = false;
      this.nuevoTutor = {
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        rol: 'usuario',
        rut: ''
      }
    })
  }
}
