import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CdkTableModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly http = inject(HttpClient);
  readonly games = signal<string[]>([]);

  title = 'mega-sena-ui';

  numGames: number = 1;
  displayedColumns: string[] = ['id', 'name'];

  fetchGames() {
    if (this.numGames >= 1 && this.numGames <= 20) {
      this.http
        .get<any[]>(
          `https://mega-sena-api.vercel.app/generate?n=${this.numGames}`
        )
        .subscribe(
          (data) => this.games.set(data),
          (error) => console.error('Erro ao buscar os jogos:', error)
        );
    } else {
      alert('Por favor, insira um número entre 1 e 20.');
    }
  }
}
