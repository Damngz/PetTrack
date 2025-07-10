import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  idUsuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private apiUrl = '/api/mascotas';

  constructor(private http: HttpClient) {}

  createMascota(mascota: Partial<Mascota>) {
    return this.http.post<Mascota>(this.apiUrl, mascota);
  }

  updateMascota(mascota: Partial<Mascota>) {
    return this.http.put<Mascota>(`${this.apiUrl}/${mascota.id}`, mascota);
  }

  deleteMascota(mascotaId: number) {
    return this.http.delete<Mascota>(`${this.apiUrl}/${mascotaId}`);
  }

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  getMascotaById(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  getByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
