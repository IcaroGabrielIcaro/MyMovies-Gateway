import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-filme-poster-deslogado',
    imports: [],
    template: `<img src="{{ url }}" class="w-28 h-40 object-cover rounded-lg shadow-lg" />`
})
export class FilmePosterDeslogadoComponent {
    @Input() url!: string;
}