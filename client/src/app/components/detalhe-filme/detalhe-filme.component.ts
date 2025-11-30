import { Component, inject, Input, signal } from "@angular/core";
import { MovieService } from "../../services/movie/movie.service";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { LikeResponse } from "../../models/movie/LikeResponse.model";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-detalhe-filme',
    imports: [CommonModule],
    templateUrl: `detalhe-filme.component.html`
})
export class DetalheFilmeComponent {
    @Input() id!: number;
    private readonly _movieService = inject(MovieService);
    private readonly _router = inject(Router);

    movie = signal<MovieResponse | null>(null);
    likes = signal<LikeResponse[]>([]);
    outrosMovies = signal<MovieResponse[]>([]);
    outrosFilmesAmostragem = signal<MovieResponse[]>([]);

    ngOnInit() {
        this.resgatarFilme(this.id);
        this.resgatarLikes(this.id);
    }

    resgatarFilme(id: number) {
        this._movieService.getById(id).subscribe({
            next: (data: any) => {
                const filme = data;
                console.log("resgatado com sucesso:", filme);
                this.movie.set(filme);

                if (filme) {
                    this._movieService.listar({idUsuario: filme.id_usuario}).subscribe({
                        next: (data: any) => {
                            const outros = data;
                            this.outrosMovies.set(outros);
                            console.log('✅ MEUS FILMES:', this.outrosMovies());

                            this.outrosFilmesAmostragem.set(this.outrosMovies().slice(0, 3));
                        },
                        error: (err) => {
                            console.error('❌ ERRO AO LISTAR OUTROS FILMES:', err);
                        }
                    });
                }
            },
            error: (err) => {
                console.log("erro na criação:", err);
            }
        });
    }

    resgatarLikes(id: number) {
        this._movieService.listarCurtidas(id).subscribe({
            next: (data: LikeResponse[]) => {
                const likes = data;
                console.log('likes resgatados com sucesso', likes);
                this.likes.set(likes);
            },
            error: (err) => {
                console.log('erro resgatando likes:', err);
            }
        })
    }

    ehDono(): boolean {
        const logado = Number(sessionStorage.getItem('id_usuario'));

        if (logado == this.movie()?.id_usuario) return true;
        else return false;
    }

    jaCurtiu(): boolean {
        const logado = Number(sessionStorage.getItem('id_usuario'));
        const list = this.likes();

        if (!Array.isArray(list) || !Number.isInteger(logado) || logado <= 0) {
            return false;
        }

        return list.some(like => Number(like.id_usuario) === logado);
    }

    deletar(id: number) {
        if (!id) return;

        const confirmar = confirm("Tem certeza que deseja deletar este filme? Esta ação não pode ser desfeita.");

        if (!confirmar) {
            console.log("Operação cancelada pelo usuário.");
            return;
        }

        this._movieService.deletar(id).subscribe({
            next: (data: { message: string }) => {
                console.log(data.message);
                this._router.navigate(['/']);
            },
            error: (err) => {
                console.error('Erro ao deletar', err);
            }
        });
    }

    curtir(id: number) {
        if (!id) return;

        this._movieService.curtir(id).subscribe({
            next: (res) => {
                console.log('Curtido com sucesso:', res);
                this.resgatarLikes(id);
            },
            error: (err) => {
                console.error('Erro ao curtir:', err);
            }
        });
    }

    descurtir(id: number) {
        if (!id) return;

        this._movieService.descurtir(id).subscribe({
            next: (res) => {
                console.log('Descurtido com sucesso:', res);
                this.resgatarLikes(id);
            },
            error: (err) => {
                console.error('Erro ao descurtir:', err);
            }
        });
    }
}