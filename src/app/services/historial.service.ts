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
  // private apiUrl = 'http://localhost:8082/historial_medico';
  private apiUrl = '/api/historial_medico';

  constructor(private http: HttpClient) {}

  createAtencion(atencion: HistorialMedico) {
    return this.http.post<HistorialMedico>(this.apiUrl, atencion);
  }

  getByMascotaId(id: number): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(`${this.apiUrl}/mascota/${id}`);
  }
}
