import { Component, Input } from "@angular/core";
import { MovieResponse } from "../../models/movie/MovieResponse.model";

@Component({
    selector: 'app-card-filme',
    imports: [],
    template: `
    <div class="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer">
        <img [src]="movie.poster || movie.foto" [alt]="movie.nome" class="w-full h-64 object-cover"/>
        <div class="p-3 text-center">
            <p class="font-bold truncate">{{ movie.nome }}</p>
            <p class="text-sm opacity-60">{{ movie.nacionalidade }}</p>
        </div>
    </div>
    `
})
export class CardFilmeComponent {
    @Input() movie!: MovieResponse;
}