import { ChangeDetectorRef, Component, computed, inject, signal } from "@angular/core";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { CommonModule } from "@angular/common";
import { MovieService } from "../../services/movie/movie.service";
import { FilmeFlutuanteComponent } from "./filme-flutuante.component";
import { CarrosselFilmesComponent } from "./carrossel-filmes.component";

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
    private readonly cdr = inject(ChangeDetectorRef);

    movies: MovieResponse[] = [];
    myMovies: MovieResponse[] = [];
    slicedMovies: MovieResponse[] = [];
    mainBannerUrl: string =
        'https://image.tmdb.org/t/p/w500_and_h282_face/yQXfTbb5T4zVdZShGuPaZersiJc.jpg';

    selectedMovieIndex: number | null = null;
    currentMovie: MovieResponse | null = null;

    ngOnInit(): void {
        this.buscarFilmes();
    }

    buscarFilmes() {
        this._movieService.listar({}).subscribe({
            next: (filmes) => {
                console.log('✅ FILMES RECEBIDOS NO COMPONENT:', filmes);

                this.movies = filmes;

                this.slicedMovies = this.movies.slice(0, 9);

                const defaultMovie = this.movies.find(m => m.id === 1) || this.slicedMovies[0];

                if (defaultMovie) {
                    this.mainBannerUrl = defaultMovie.foto;
                    this.currentMovie = defaultMovie;
                    this.selectedMovieIndex = this.slicedMovies.findIndex(m => m.id === defaultMovie.id);
                }

                const logado = Number(sessionStorage.getItem('id_usuario'));

                if (!logado) {
                    console.warn('⚠ Usuário não encontrado no sessionStorage');
                    return;
                }

                this._movieService.listar({idUsuario: logado}).subscribe({
                    next: (filmex) => {
                        this.myMovies = filmes;
                        console.log('✅ MEUS FILMES:', this.myMovies);

                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        console.error('❌ ERRO AO LISTAR MEUS FILMES:', err);
                    }
                });

                this.cdr.detectChanges();
            }, error: (err) => {
                console.error('❌ ERRO AO LISTAR FILMES:', err);
            }
        });
    }

    trocarBanner(foto: string, index: number) {
        this.mainBannerUrl = foto;
        this.selectedMovieIndex = index;
        this.currentMovie = this.slicedMovies[index];
    }

    get movieTitle(): string {
        if (!this.currentMovie?.nome) return 'Título do Filme';

        return this.currentMovie.nome.length > 23
            ? this.currentMovie.nome.slice(0, 23) + '...'
            : this.currentMovie.nome;
    }
}
