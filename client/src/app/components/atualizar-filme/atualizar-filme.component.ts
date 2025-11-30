import { Component, inject, Input, signal } from "@angular/core";
import { MovieService } from "../../services/movie/movie.service";
import { Genero, MovieRequest } from "../../models/movie/MovieRequest.model";
import { Field, form, maxLength, minLength, required } from "@angular/forms/signals";
import { Router } from "@angular/router";

@Component({
    selector: 'app-atualizar-filme',
    imports: [Field],
    templateUrl: `atualizar-filme.component.html`
})
export class AtualizarFilmeComponent {
    @Input() id!: number;
    private readonly _movieService = inject(MovieService);
    private readonly _router = inject(Router);

    movie = signal<MovieRequest | null>(null);
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

    ngOnInit() {
        this.resgatarFilme(this.id);
    }

    resgatarFilme(id: number) {
        this._movieService.getById(id).subscribe({
            next: (data: any) => {
                const filme = data;
                console.log("resgatado com sucesso:", filme);
                this.movie.set(filme);

                const m = this.movie();
                if (m) {
                    this.movieModel.set({
                        nome: m.nome,
                        diretor: m.diretor,
                        review: m.review,
                        genero: m.genero,
                        nota: m.nota,
                        data_assistida: m.data_assistida,
                        duracao: m.duracao,
                        favorito: m.favorito,
                        foto: m.foto,
                        poster: m.poster,
                        ano: m.ano,
                        nacionalidade: m.nacionalidade
                    })
                }
            },
            error: (err) => {
                console.log("erro na criação:", err);
            }
        });
    }

    atualizar() {
        if (this.movieForm().valid()) {
            const req = this.movieModel();
            this._movieService.atualizar(this.id, req).subscribe({
                next: (data: any) => {
                    console.log('atualizado', data);
                    this._router.navigate(['/filmes/', this.id]);
                }, error: (err) => {
                    console.log("Erro na atualização:", err)
                }
            })
        }
    }

    voltar() {
        this._router.navigate(['../']);
    }
}