import { ChangeDetectorRef, Component, inject, signal } from "@angular/core";
import { MovieService } from "../../services/movie/movie.service";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { CommonModule } from "@angular/common";
import { FiltroRequest } from "../../models/movie/FiltroRequest.model";
import { Field, form } from "@angular/forms/signals";
import { CardFilmeComponent } from "./card-filme.component";
import { MovieEventsService } from "../../services/movie/movie-events.service";

@Component({
    selector: 'app-lista-filme',
    imports: [Field, CommonModule, CardFilmeComponent],
    templateUrl: 'lista-filme.component.html',
})
export class ListaFilmeComponent {
    private readonly _movieService = inject(MovieService);
    private readonly _movieEventService = inject(MovieEventsService);

    movies = signal<MovieResponse[]>([]);

    filtroModel = signal<FiltroRequest>({
        nome: '',
        diretor: '',
        nacionalidade: '',
        idUsuario: '',
        apenasMeus: false,
    })

    filtroForm = form(this.filtroModel);

    ngOnInit(): void {
        this._movieEventService.filmeCriado.subscribe(() => {
            console.log('📢 Evento recebido: filme criado. Recarregando...');
            this.recarregarFilmes();
        });

        this.buscarFilmes();
    }

    buscarFilmes() {
        const { nome, diretor, nacionalidade, apenasMeus, idUsuario } = this.filtroModel();

        const params: any = {};

        if (nome?.trim()) {
            params.nome = nome.trim();
        }

        if (diretor?.trim()) {
            params.diretor = diretor.trim();
        }

        if (nacionalidade?.trim()) {
            params.nacionalidade = nacionalidade.trim();
        }

        if (apenasMeus) {
            const idUsuarioLogado = sessionStorage.getItem('id_usuario');
            if (idUsuarioLogado) {
                params.idUsuario = Number(idUsuarioLogado);
            }
        } else if (idUsuario?.trim()) {
            const id = Number(idUsuario.trim());
            if (!isNaN(id)) {
                params.idUsuario = id;
            }
        }

        console.log('✅ PARAMS FINAIS:', params);

        this._movieService.listar(params).subscribe({
            next: (data: any) => {
                console.log('🎬 FILMES RECEBIDOS:', data);
                const filmes = data;
                this.movies.set(filmes);
            },
            error: (err) => {
                console.error('❌ ERRO AO LISTAR FILMES:', err);
            }
        });
    }

    limparFiltros() {
        this.filtroModel.set({
            nome: '',
            diretor: '',
            nacionalidade: '',
            idUsuario: '',
            apenasMeus: false,
        });

        this.buscarFilmes();
    }
    
    recarregarFilmes() {
        console.log('🔄 Recarregando filmes...');
        this.buscarFilmes();
    }
}