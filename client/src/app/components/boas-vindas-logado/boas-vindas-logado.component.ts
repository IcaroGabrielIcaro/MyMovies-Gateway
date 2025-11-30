import { ChangeDetectorRef, Component, computed, inject, signal } from "@angular/core";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { CommonModule } from "@angular/common";
import { MovieService } from "../../services/movie/movie.service";
import { FilmeFlutuanteComponent } from "./filme-flutuante.component";
import { CarrosselFilmesComponent } from "./carrossel-filmes.component";
import { MovieEventsService } from "../../services/movie/movie-events.service";

@Component({
    selector: 'app-boas-vindas-logado',
    imports: [
        CommonModule,
        FilmeFlutuanteComponent,
        CarrosselFilmesComponent
    ],
    templateUrl: `./boas-vindas-logado.component.html`
})
export class BoasVindasLogadoComponent {
    private readonly _movieService = inject(MovieService);
    private readonly _movieEventService = inject(MovieEventsService);

    movies = signal<MovieResponse[]>([]);
    myMovies = signal<MovieResponse[]>([]);
    slicedMovies = signal<MovieResponse[]>([]);
    mainBannerUrl = signal<string>('https://image.tmdb.org/t/p/w500_and_h282_face/yQXfTbb5T4zVdZShGuPaZersiJc.jpg');
    selectedMovieIndex = signal<number | null>(null);
    currentMovie = signal<MovieResponse | null>(null);

    ngOnInit(): void {
        this._movieEventService.filmeCriado.subscribe(() => {
            console.log('📢 Evento recebido: filme criado. Recarregando...');
            this.recarregarFilmes();
        });

        this.buscarFilmes();
    }

    buscarFilmes() {
        this._movieService.listar({}).subscribe({
            next: (dados: any) => {
                console.log('✅ FILMES RECEBIDOS NO COMPONENT:', dados);
                const filmes = dados;
                this.movies.set(filmes);

                this.slicedMovies.set(this.movies().slice(0, 9));

                const defaultMovie = this.movies().find(m => m.id === 1) || this.slicedMovies()[0];

                if (defaultMovie) {
                    this.mainBannerUrl.set(defaultMovie.foto);
                    this.currentMovie.set(defaultMovie);
                    this.selectedMovieIndex.set(this.slicedMovies().findIndex(m => m.id === defaultMovie.id));
                }

                const logado = Number(sessionStorage.getItem('id_usuario'));

                if (!logado) {
                    console.warn('⚠ Usuário não encontrado no sessionStorage');
                    return;
                }

                this._movieService.listar({idUsuario: logado}).subscribe({
                    next: (data: any) => {
                        const meusFilmes = data;
                        this.myMovies.set(meusFilmes);
                        console.log('✅ MEUS FILMES:', this.myMovies());
                    },
                    error: (err) => {
                        console.error('❌ ERRO AO LISTAR MEUS FILMES:', err);
                    }
                });

            }, error: (err) => {
                console.error('❌ ERRO AO LISTAR FILMES:', err);
            }
        });
    }

    trocarBanner(foto: string, index: number) {
        this.mainBannerUrl.set(foto);
        this.selectedMovieIndex.set(index);
        this.currentMovie.set(this.slicedMovies()[index]);
    }

    get movieTitle(): string {
        if (!this.currentMovie()?.nome) return 'Título do Filme';

        const nome = this.currentMovie()?.nome ?? '';
        return nome.length > 23 ? nome.slice(0, 23) + '...' : nome;
    }

    recarregarFilmes() {
        console.log('🔄 Recarregando filmes...');
        this.buscarFilmes();
    }
}