import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type HorarioAtencion = {
  id?: number;
  idUsuario: number;
  diaSemana: string; // LUNES, MARTES...
  horaInicio: string;
  horaFin: string;
};

@Injectable({ providedIn: 'root' })
export class HorarioAtencionService {
  private apiUrl = 'http://localhost:8085/horarios';

  constructor(private http: HttpClient) {}

  getHorariosUsuario(idUsuario: number): Observable<HorarioAtencion[]> {
    return this.http.get<HorarioAtencion[]>(`${this.apiUrl}/${idUsuario}`);
  }

  guardarHorarios(horarios: HorarioAtencion[]): Observable<any> {
    return this.http.post(this.apiUrl, horarios);
  }
}
