import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {
  private apiUrl = '/api/usuarios/usuarios';

  constructor(private http: HttpClient) {}

  createTutor(usuario: Partial<Usuario>) {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  getUsuarios() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioPorId(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getUsuarioPorCorreo(correo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/correo/${correo}`);
  }

  getUsuariosTutores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/tutores`);
  }

  getUsuariosVeterinarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/veterinarios`);
  }
}
