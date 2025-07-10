import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HistorialMedico {
  idHistorial: number;
  idMascota: number;
  idUsuario: number;  // veterinario
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private baseUrl = '/api/historial/historial_medico';

  constructor(private http: HttpClient) {}

  createAtencion(atencion: HistorialMedico) {
    return this.http.post<HistorialMedico>(this.baseUrl, atencion);
  }

  getByMascotaId(id: number): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(`${this.baseUrl}/mascota/${id}`);
  }
}
