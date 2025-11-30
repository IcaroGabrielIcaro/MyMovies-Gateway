import { Component, inject, signal } from "@angular/core";
import { MovieService } from "../../services/movie/movie.service";
import { Genero, MovieRequest } from "../../models/movie/MovieRequest.model";
import { Field, form, maxLength, minLength, required } from "@angular/forms/signals";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-criar-filme',
    imports: [CommonModule, Field],
    templateUrl: `criar-filme.component.html`
})
export class CriarFilmeComponent {
    private readonly _movieService = inject(MovieService);

    previewFoto: string | null = null;
    previewPoster: string | null = null;
    Genero = Genero;

    movieModel = signal<MovieRequest>({
        nome: '',
        diretor: '',
        review: '',
        genero: Genero.Acao,
        nota: '',
        data_assistida: '',
        duracao: '',
        favorito: false,
        foto: '',
        poster: '',
        ano: '',
        nacionalidade: ''
    })

    movieForm = form(this.movieModel, (f) => {
        required(f.nome);
        required(f.diretor);
        required(f.ano);
        minLength(f.nota, 0);
        maxLength(f.nota, 10);
    });

    criar() {
        if (this.movieForm().valid()) {
            const req = this.movieModel();
            this._movieService.inserir(req).subscribe({
                next: (filme) => {
                    console.log("criado com sucesso", filme)
                },
                error: (err) => {
                    console.log("Erro na criação:", err)
                }
            });
        } else {
            return;
        }
    }

    resetarFormulario() {
        this.movieModel.set({
            nome: '',
            diretor: '',
            review: '',
            genero: Genero.Acao,
            nota: '',
            data_assistida: '',
            duracao: '',
            favorito: false,
            foto: '',
            poster: '',
            ano: '',
            nacionalidade: ''
        });

        this.previewFoto = null;
        this.previewPoster = null;
    }

    handleImageError(event: Event) {
        const imgElement = event.target as HTMLImageElement;
        imgElement.style.display = 'none';
    }
}