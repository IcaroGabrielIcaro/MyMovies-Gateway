import { ChangeDetectorRef, Component, inject, signal } from "@angular/core";
import { MovieService } from "../../services/movie/movie.service";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { CommonModule } from "@angular/common";
import { FiltroRequest } from "../../models/movie/FiltroRequest.model";
import { Field, form } from "@angular/forms/signals";
import { CardFilmeComponent } from "./card-filme.component";

@Component({
    selector: 'app-lista-filme',
    imports: [Field, CommonModule, CardFilmeComponent],
    templateUrl: 'lista-filme.component.html',
})
export class ListaFilmeComponent {
    private readonly _movieService = inject(MovieService);
    private readonly cdr = inject(ChangeDetectorRef);

    movies: MovieResponse[] = [];
    carregando: boolean = false;
    erro: boolean = false;

    filtroModel = signal<FiltroRequest>({
        nome: '',
        diretor: '',
        nacionalidade: '',
        idUsuario: '',
        apenasMeus: false,
    })

    filtroForm = form(this.filtroModel);

    ngOnInit(): void {
        this.buscarFilmes();
    }

    buscarFilmes() {
        this.carregando = true;
        this.erro = false;

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
            next: (filmes) => {
                console.log('🎬 FILMES RECEBIDOS:', filmes);
                this.movies = filmes;
                this.carregando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('❌ ERRO AO LISTAR FILMES:', err);
                this.erro = true;
                this.carregando = false;
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
}