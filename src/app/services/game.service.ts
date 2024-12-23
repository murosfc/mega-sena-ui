import { HttpClient } from '@angular/common/http';
import { Game } from '../../interfaces/game.interface';
import { map, tap, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';


interface ApiResponse {
    results: number[][];
  }

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient); 

  getGames(numGames: number): Observable<Game[]> {
    console.log('services Start numGames', numGames);
    if (numGames >= 1 && numGames <= 20) {
      return this.http
        .get<ApiResponse>(
          `https://mega-sena-api.vercel.app/generate?quantity=${numGames}`
        )
        .pipe(
          tap(response => console.log('Resposta da API:', response)),
          map((response: ApiResponse) => 
            response.results.map(numbers => ({ game: numbers }) as Game)
          ),
          tap(games => console.log('Jogos formatados:', games))
        );
    }    
    throw new Error('O número de jogos deve estar entre 1 e 20');
  }
}