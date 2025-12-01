import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { MovieService } from "../../services/movie/movie.service";
import { Genero, MovieRequest } from "../../models/movie/MovieRequest.model";
import { Field, form, maxLength, minLength, required } from "@angular/forms/signals";
import { CommonModule } from "@angular/common";
import { MovieEventsService } from "../../services/movie/movie-events.service";

@Component({
    selector: 'app-criar-filme',
    imports: [CommonModule, Field],
    templateUrl: `criar-filme.component.html`
})
export class CriarFilmeComponent {
    private readonly _movieService = inject(MovieService);
    private readonly _movieEventService = inject(MovieEventsService);

    @Output() fechar = new EventEmitter<void>();

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
                    this._movieEventService.filmeCriado.next();
                    this.fechar.emit();
                },
                error: (err) => {
                    console.log("Erro na criação:", err)
                }
            });
        } else {
            return;
        }
    }

    criarVarios() {
        const filmes = [
            {
                nome: 'Trovão Tropical',
                diretor: 'Ben Stiller',
                review: 'Uma sátira absurda e genial sobre Hollywood e filmes de guerra.',
                genero: Genero.Acao,
                nota: '9',
                data_assistida: '2025-01-10',
                duracao: '107',
                favorito: true,
                foto: 'https://play-lh.googleusercontent.com/proxy/22A2xFu9VF67e_KdcO4lHgcmEsS9PfTIIucnmAlgm5udBzkSePiuozY25RAwawyURoCf9rFugQSyg2quA8LCZvtF7ZKM00-SB-lB0d4cVOBg7DYUtCNb=s1920-w1920-h1080',
                poster: 'https://tse2.mm.bing.net/th/id/OIP.GOp7mqkKSe8V5V6LQwkI0gAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '2008',
                nacionalidade: 'Estados Unidos'
            },

            {
                nome: 'Scarface',
                diretor: 'Brian De Palma',
                review: 'A ascensão e queda de um criminoso icônico. Clássico absoluto.',
                genero: Genero.Acao,
                nota: '10',
                data_assistida: '2025-01-12',
                duracao: '170',
                favorito: true,
                foto: 'https://tse1.mm.bing.net/th/id/OIP.5MUM9-984Y45COYzf31lTAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
                poster: 'https://tse4.mm.bing.net/th/id/OIP.pOKruHJvwDUsucz2-lsl7AHaKs?w=554&h=800&rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '1983',
                nacionalidade: 'Estados Unidos'
            },

            {
                nome: 'Pulp Fiction',
                diretor: 'Quentin Tarantino',
                review: 'Narrativa não-linear brilhante, diálogos icônicos e trilha perfeita.',
                genero: Genero.Acao,
                nota: '10',
                data_assistida: '2025-01-15',
                duracao: '154',
                favorito: true,
                foto: 'https://tse2.mm.bing.net/th/id/OIP.AjJKTIVpQJLL-xt-ozlTPQHaDt?rs=1&pid=ImgDetMain&o=7&rm=3',
                poster: 'https://tse1.mm.bing.net/th/id/OIP.z6bKjfyEmcYCRRPy4b0_KgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '1994',
                nacionalidade: 'Estados Unidos'
            },

            {
                nome: 'Lisbela e o Prisioneiro',
                diretor: 'Guel Arraes',
                review: 'Romance nordestino leve, engraçado e extremamente carismático.',
                genero: Genero.Romance,
                nota: '8',
                data_assistida: '2025-01-18',
                duracao: '106',
                favorito: false,
                foto: 'https://tse2.mm.bing.net/th/id/OIP.MOGrFOu6H5QbDJfEXS4w6wHaFA?rs=1&pid=ImgDetMain&o=7&rm=3',
                poster: 'https://tse4.mm.bing.net/th/id/OIP.fOfL3zUQPdTq3utdYI_ySAHaLK?rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '2003',
                nacionalidade: 'Brasil'
            },

            {
                nome: 'Monty Python em Busca do Cálice Sagrado',
                diretor: 'Terry Gilliam & Terry Jones',
                review: 'Humor nonsense levado à perfeição. Cada cena é um meme.',
                genero: Genero.Comedia,
                nota: '9',
                data_assistida: '2025-01-20',
                duracao: '91',
                favorito: true,
                foto: 'https://image.tmdb.org/t/p/original/2AUvfoZlOwlQgMyNxAXAqUbTfwi.jpg',
                poster: 'https://tse4.mm.bing.net/th/id/OIP.x1mNgpCG9I7bAiNn9m84kgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '1975',
                nacionalidade: 'Reino Unido'
            },

            {
                nome: 'Jackie Brown',
                diretor: 'Quentin Tarantino',
                review: 'Mais maduro, com ritmo lento e personagens extremamente bem escritos.',
                genero: Genero.Acao,
                nota: '9',
                data_assistida: '2025-01-22',
                duracao: '154',
                favorito: false,
                foto: 'https://th.bing.com/th/id/R.c994c82ccf589476404019c69f132a2a?rik=YmbgW5CmneXfMw&pid=ImgRaw&r=0',
                poster: 'https://tse3.mm.bing.net/th/id/OIP.E19NTWucTEnL9NKALFOlrQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '1997',
                nacionalidade: 'Estados Unidos'
            },

            {
                nome: 'Austin Powers: O Agente Bond Cama',
                diretor: 'Jay Roach',
                review: 'Paródia perfeita dos filmes de espionagem com humor escrachado.',
                genero: Genero.Comedia,
                nota: '8',
                data_assistida: '2025-01-25',
                duracao: '94',
                favorito: false,
                foto: 'https://br.web.img3.acsta.net/medias/nmedia/18/35/91/46/18608824.jpg',
                poster: 'https://m.media-amazon.com/images/S/pv-target-images/9b3b3c80a9692b0e44ae955196994286c1f57b3bced854e57676161302e379ef.jpg',
                ano: '1997',
                nacionalidade: 'Estados Unidos'
            },

            {
                nome: 'Chainsaw Man: The Reze Arc',
                diretor: 'Ryu Nakayama',
                review: 'Arco emocionalmente pesado com ação insana e trilha absurda.',
                genero: Genero.Acao,
                nota: '9',
                data_assistida: '2025-01-28',
                duracao: '120',
                favorito: true,
                foto: 'https://criticalhits.com.br/wp-content/uploads/2024/12/Chainsaw-Man-Reze-Arc-Poster-2.jpg',
                poster: 'https://m.media-amazon.com/images/M/MV5BZmMzNGVhODktYmU5MS00MDg1LThlNTEtNTMyYTg5MDA0Njk4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                ano: '2024',
                nacionalidade: 'Japão'
            },

            {
                nome: 'Apenas um Show: O Filme',
                diretor: 'J.G. Quintel',
                review: 'Fan service perfeito com emoção, caos e humor do início ao fim.',
                genero: Genero.Aventura,
                nota: '9',
                data_assistida: '2025-01-30',
                duracao: '75',
                favorito: true,
                foto: 'https://uploads.jovemnerd.com.br/wp-content/uploads/Regular_Show_Season_6_Episode_181-Still.jpg',
                poster: 'https://m.media-amazon.com/images/M/MV5BYWZlYjM3ZTAtOWE1YS00NzgyLThjYjctNzU5MDhhODExYWJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                ano: '2015',
                nacionalidade: 'Estados Unidos'
            },

            {
                nome: 'Corra Que a Polícia Vem Aí',
                diretor: 'David Zucker',
                review: 'Comédia clássica com piadas a cada segundo. Leslie Nielsen eterno.',
                genero: Genero.Comedia,
                nota: '9',
                data_assistida: '2025-02-01',
                duracao: '85',
                favorito: true,
                foto: 'https://tse3.mm.bing.net/th/id/OIP.dok_ClRCSmg6ESmOIXMpnwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
                poster: 'https://tse1.mm.bing.net/th/id/OIP.gYXlHEOonjDbuuKLAuqQnQHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
                ano: '1988',
                nacionalidade: 'Estados Unidos'
            }
        ];


        filmes.forEach((req) => {
            this._movieService.inserir(req).subscribe({
                next: (filme) => {
                    console.log("criado com sucesso", filme)
                    this._movieEventService.filmeCriado.next();
                },
                error: (err) => {
                    console.log("Erro na criação:", err)
                }
            });
        });
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