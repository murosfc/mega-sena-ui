import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Game } from '../../interfaces/game.interface';
import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);

  async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  async getUserLocation(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return `${data.city}, ${data.region}, ${data.country}`;
    } catch (error) {
      return 'unknown';
    }
  }

  getGames(numGames: number): Observable<Game[]> {
    if (numGames < 1 || numGames > 20) {
      throw new Error('O número de jogos deve estar entre 1 e 20');
    }

    return from(Promise.all([this.getUserIP(), this.getUserLocation()])).pipe(
      switchMap(([ip, location]) => {
        const headers = new HttpHeaders()
          .set('ip', ip)
          .set('location', location)
          .set('userAgent', navigator.userAgent);

        return this.http
          .get<ApiResponse>(
            `https://mega-sena-api.vercel.app/generate?quantity=${numGames}`,
            { headers }
          )
          .pipe(
            tap((response) => console.log('Resposta da API:', response)),
            map((response: ApiResponse) =>
              response.results.map((numbers) => ({ game: numbers } as Game))
            )
          );
      })
    );
  }
}
