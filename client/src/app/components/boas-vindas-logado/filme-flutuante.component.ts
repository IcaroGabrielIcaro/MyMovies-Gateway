import { Component, EventEmitter, input, Input, Output } from "@angular/core";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-filme-flutuante',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
      class="relative w-full h-full aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out shadow-lg"
      [ngClass]="{'scale-105': selectedMovieIndex === index, 'hover:scale-105': selectedMovieIndex !== index}"
      (click)="emitirTroca()">

      <img [src]="movie.foto" [alt]="movie.nome" class="w-full h-full object-cover transition-all duration-300"
        [ngClass]="{'brightness-100': selectedMovieIndex === index, 'hover:brightness-100': selectedMovieIndex !== index, 'brightness-50 saturate-75': selectedMovieIndex !== index}"/>

      <div class="absolute inset-0 transition-all duration-300"
        [ngClass]="{'bg-slate-800/0': selectedMovieIndex === index, 'bg-slate-800/50 hover:bg-slate-800/20': selectedMovieIndex !== index}"></div>
    </div>
  `
})
export class FilmeFlutuanteComponent {
    @Input() movie!: MovieResponse;
    @Input() selectedMovieIndex!: number | null;
    @Input() index!: number;

    @Output() trocarBanner = new EventEmitter<{ foto: string; index: number }>();

    emitirTroca() {
        this.trocarBanner.emit({
            foto: this.movie.foto,
            index: this.index
        });
    }
}
