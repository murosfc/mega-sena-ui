import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Game } from '../../interfaces/game.interface';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { GameResults } from '../../interfaces/game-results.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);

  async getUserData(): Promise<{ ip: string; localizacao: string }> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        localizacao: `${data.city}, ${data.region_code}, ${data.country}`,
      };
    } catch (error) {
      return { ip: 'unknown', localizacao: 'unknown' };
    }
  }

  getAllGames(): Observable<GameResults[]> {
    return this.http.get<GameResults[]>(
      'https://mega-sena-api.vercel.app/get-all-games'
    );
  }

  getGames(numGames: number): Observable<Game[]> {
    if (numGames < 1 || numGames > 20) {
      throw new Error('O número de jogos deve estar entre 1 e 20');
    }

    return from(Promise.all([this.getUserData()])).pipe(
      switchMap(([userData]) => {
        const headers = new HttpHeaders()
          .set('ip', userData.ip)
          .set('localizacao', userData.localizacao)
          .set('userAgent', navigator.userAgent);

        return this.http
          .get<ApiResponse>(
            `https://mega-sena-api.vercel.app/generate?quantity=${numGames}`,
            { headers }
          )
          .pipe(
            map((response: ApiResponse) =>
              response.results.map((numbers) => ({ game: numbers } as Game))
            )
          );
      })
    );
  }
}
