import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieResponse } from '../../models/movie/MovieResponse.model';

@Component({
    selector: 'app-card-filme',
    imports: [CommonModule, RouterModule],
    template: `
    <div [routerLink]="link" class="flex flex-col items-center transition-transform hover:scale-105 cursor-pointer shrink-0">
      <div class="w-55 h-84 rounded-xl overflow-hidden shadow-lg bg-slate-800">
        <img [src]="movie.poster" [alt]="movie.nome" class="w-full h-full object-cover object-center"/>
      </div>
    </div>
  `
})
export class CardFilmeComponent {
    @Input({ required: true }) movie!: MovieResponse;
    @Input() link: any[] = [];
}
