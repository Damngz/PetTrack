import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vacuna {
  id?: number;
  idMascota: number;
  idUsuario: number;
  nombre: string;
  fechaAplicacion: string;
  dosis: string;
  observaciones: string;
}


@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private apiUrl = 'http://localhost:8083/vacunas';

  constructor(private http: HttpClient) {}

  getByMascota(idMascota: number): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.apiUrl}/mascota/${idMascota}`);
  }

  getAll(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(this.apiUrl);
  }

  createVacuna(vacuna: Vacuna): Observable<Vacuna> {
    return this.http.post<Vacuna>(this.apiUrl, vacuna);
  }
}
