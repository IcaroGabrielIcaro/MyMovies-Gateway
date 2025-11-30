import { Component, inject, input, Input } from "@angular/core";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MovieEventsService } from "../../services/movie/movie-events.service";

@Component({
    selector: 'app-card-filme',
    imports: [CommonModule],
    template: `
    <div (click)="mudar(movie.id)" class="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer">
        <img [src]="movie.poster || movie.foto" [alt]="movie.nome" class="w-full object-cover" [ngClass]="alturaClasses[tamanho]" />
        <div class="p-3 text-center">
            <p class="font-bold truncate">{{ movie.nome }}</p>
            <p class="text-sm opacity-60">{{ movie.nacionalidade }}</p>
        </div>
    </div>
    `
})
export class CardFilmeComponent {
    @Input() movie!: MovieResponse;
    @Input() tamanho: 'sm' | 'md' | 'lg' = 'md';

    private readonly _movieEventService = inject(MovieEventsService);
    private readonly _router = inject(Router);

    alturaClasses = {
        sm: 'h-40',
        md: 'h-64',
        lg: 'h-80',
    };

    mudar(id: number) {
        this._movieEventService.filmeCriado.next();
        this._router.navigate(['/filmes/', id]);
    }
}