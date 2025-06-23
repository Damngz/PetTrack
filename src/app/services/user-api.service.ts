import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {
  private apiUrl = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarioPorCorreo(correo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/correo/${correo}`);
  }
}
