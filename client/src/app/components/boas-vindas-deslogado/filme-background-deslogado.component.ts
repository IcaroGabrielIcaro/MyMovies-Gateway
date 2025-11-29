import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-filme-background-deslogado',
    imports: [],
    template: `<img src="{{ url }}" class="w-full h-full object-cover" />`
})
export class FilmeBackgroundDeslogadoComponent {
    @Input() url!: string
}