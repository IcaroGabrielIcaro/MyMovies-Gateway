import { Component, inject, signal } from "@angular/core";
import { UserService } from "../../services/user/user.servive";
import { UserResponse } from "../../models/user/UserResponse.model";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { MovieService } from "../../services/movie/movie.service";
import { CarrosselFilmesComponent } from "../boas-vindas-logado/carrossel-filmes.component";
import { CardFilmeComponent } from "../lista-filme/card-filme.component";

@Component({
    selector: 'app-detalhe-usuario',
    imports: [
        RouterLink,
        CarrosselFilmesComponent,
        CardFilmeComponent
    ],
    templateUrl: `detalhar-usuario.component.html`
})
export class DetalheUsuarioComponent {
    private readonly _userService = inject(UserService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _movieService = inject(MovieService);

    user = signal<UserResponse | null>(null);
    isLogged = signal<boolean>(false);
    isOwner = signal<boolean>(false);
    userNotFound = signal<boolean>(false);
    showConfigurations = signal<boolean>(false);
    fotoBanner: string = 'https://alchetron.com/cdn/kraken-pirates-of-the-caribbean-cf64727a-72ad-406d-9b10-f0dd5d1d65c-resize-750.jpg';

    filmesFavoritos = signal<MovieResponse[]>([]);
    filmesFavoritosSelecionados = signal<MovieResponse[]>([]);
    ultimosFilmes = signal<MovieResponse[]>([]);

    ngOnInit() {
        const token = sessionStorage.getItem('token');
        const idLogado = Number(sessionStorage.getItem('id_usuario'));
        const idUrl = Number(this._route.snapshot.paramMap.get('id'));

        this.isLogged.set(!!token);

        if (idUrl) {
            this.resgatarUsuario(idUrl, idLogado);
        } else {
            this.userNotFound.set(true);
        }
    }

    resgatarUsuario(idUrl: number, idLogado: number) {
        this._userService.pegar(idUrl).subscribe({
            next: (data: any) => {
                const usuario = data;
                console.log("resgato com sucesso", usuario);
                this.user.set(usuario);

                this.isOwner.set(idUrl === idLogado);

                this.resgatarFilmesFavoritos(idUrl);
                this.resgatarFilmesUsuario(idUrl);
            },
            error: (err) => {
                console.log("ERRO AO RESGATAR USUARIO:", err);
                this.user.set(null);
                this.userNotFound.set(true);
            }
        })
    }

    resgatarFilmesFavoritos(id: number) {
        this._movieService.listar({idUsuario: id, favorito: true}).subscribe({
            next: (dados: any) => {
                console.log("filmes recebidos no compoennte:", dados);
                const filmes = dados;
                this.filmesFavoritos.set(filmes);
                this.filmesFavoritosSelecionados.set(this.filmesFavoritos().slice(0,3));
            },
            error: (err) => {
                console.log("erro ao listar filmes favoritos:", err);
            }
        });
    }

    resgatarFilmesUsuario(id: number) {
        this._movieService.listar({idUsuario: id}).subscribe({
            next: (dados: any) => {
                console.log("filmes do usuario recebidos no componente:", dados);
                const filmes = dados;
                this.ultimosFilmes.set(filmes);
            },
            error: (err) => {
                console.log('erro ao recuperar ultimos filmes do usuario:', err);
            }
        });
    }

    abrirConfiguracao() {
        this.showConfigurations.set(true);
    }

    fecharConfiguracao() {
        this.showConfigurations.set(false);
    }

    deletarPerfil(id: number) {
        if (!id) return;

        const confirmar = confirm("Tem certeza que deseja deletar o seu perfil?");

        if (!confirmar) {
            console.log("Operação cancelada pelo usuário.")
            return;
        }

        this._userService.deletar(id).subscribe({
            next: () => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('id_usuario');

                this._router.navigate(['/']);
            },
            error: (err) => {
                console.error("Erro ao deletar perfil:", err);
                alert("Erro ao deletar o perfil.");
            }
        });
    }

    voltar() {
        this._router.navigate(['../home']);
    }
}