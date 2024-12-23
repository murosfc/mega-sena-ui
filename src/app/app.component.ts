import { Component, inject, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CdkTableModule } from '@angular/cdk/table';
import { GameService } from './services/game.service';
import { Game } from '../interfaces/game.interface';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CdkTableModule, FormsModule, MatSnackBarModule],
  providers: [GameService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly gameService = inject(GameService);
  private readonly snackBar = inject(MatSnackBar);
  readonly games = signal<Game[]>([]);

  title = 'mega-sena-ui';
  numGames: number = 1;
  displayedColumns: string[] = ['id', 'name'];

  copyToClipboard(text: string): void {
    const successful = this.clipboard.copy(text);
    
    if (successful) {
      this.snackBar.open('Números copiados com sucesso!', 'Fechar', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
  formatGameNumbers(numbers: number[]): string {
    return numbers
      .map(num => num.toString().padStart(2, '0'))
      .join('-');
  }
  
  getGames() {    
    this.gameService.getGames(this.numGames).subscribe((games) => {
      const gamesWithIds = games.map((game, index) => ({
        ...game,
        id: index + 1
      }));
      this.games.set(gamesWithIds);
    });
  }
}
