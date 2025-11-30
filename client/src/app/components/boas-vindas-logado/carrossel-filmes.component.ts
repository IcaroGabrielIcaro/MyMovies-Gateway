import { Component, computed, Input, signal } from "@angular/core";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { CardFilmeComponent } from "./card-filme.component";

@Component({
  selector: 'app-carrossel-filmes-home',
  imports: [CardFilmeComponent],
  template: `
    <div class="w-full mt-16">

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-white">{{ titulo }}</h2>

        @if (mostrarBotoes()) {
          <div class="flex gap-3">
            <button class="bg-blue-500 hover:bg-blue-400 text-white w-10 h-10 rounded-full flex items-center justify-center" (click)="prev()">‹</button>

            <button class="bg-blue-500 hover:bg-blue-400 text-white w-10 h-10 rounded-full flex items-center justify-center" (click)="next()">›</button>
          </div>
        }
      </div>
      
      @if(visibleMovies().length > 0) {
        <div #container class="flex justify-start gap-8 overflow-hidden">
        @for (movie of visibleMovies(); track movie.id) {
          <app-card-filme [movie]="movie" [link]="[]"></app-card-filme>
          }
        </div>
      } @else {
        <div class="w-full py-20 flex flex-col items-center justify-center text-center gap-4">
          <p class="text-2xl font-semibold text-white">Nenhum filme encontrado</p>
      </div>
      }

    </div>
    `
})
export class CarrosselFilmesComponent {
  private _filmes = signal<MovieResponse[]>([]);

  @Input() set filmes(value: MovieResponse[]) {
    this._filmes.set(value || []);
  }
  @Input() titulo!: string;

  currentIndex = signal(0);
  itensPorPagina = 7;
  
  visibleMovies = computed(() => {
    const filmes = this._filmes();
    const index = this.currentIndex();

    const result = filmes.slice(index, index + this.itensPorPagina);

    console.log('🎯 visibleMovies (signal):', result);

    return result;
  });
  
  mostrarBotoes = computed(() => {
    return this._filmes().length > this.itensPorPagina;
  });

  next() {
    if (this.currentIndex() + this.itensPorPagina < this._filmes().length) {
      this.currentIndex.update(v => v + 1);
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(v => v - 1);
    }
  }
}