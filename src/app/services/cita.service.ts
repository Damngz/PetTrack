import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Cita = {
  idCita?: number;
  idMascota: number;
  idUsuario: number;
  fecha: string;
  motivo: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = '/api/citas/citas';

  constructor(private http: HttpClient) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  crearCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  actualizarCita(id: number, cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}`, cita);
  }

  eliminarCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCitasPorVeterinario(idUsuario: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  getCitasPorMascota(idMascota: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/mascota/${idMascota}`);
  }
}
