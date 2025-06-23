import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: 'usuario' | 'veterinario';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuario: Usuario | null = null;

  setUsuario(usuario: Usuario) {
    this.usuario = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): Usuario | null {
    if (!this.usuario) {
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString) {
        this.usuario = JSON.parse(usuarioString);
      }
    }
    return this.usuario;
  }

  clearUsuario() {
    this.usuario = null;
    localStorage.removeItem('usuario');
  }

  isVeterinario(): boolean {
    return this.usuario?.rol === 'veterinario';
  }

  isUsuario(): boolean {
    return this.usuario?.rol === 'usuario';
  }
}
