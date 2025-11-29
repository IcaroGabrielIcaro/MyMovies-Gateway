export interface MovieRequest {
    nome: string;
    diretor: string;
    review: string;
    genero: 'acao' | 'aventura' | 'comedia' | 'drama' | 'ficcao' | 'terror' | 'suspense' | 'animacao' | 'documentario' | 'romance' | 'fantasia';

    nota: number;

    data_assistida: string;

    duracao: number;

    favorito: boolean;
    foto: string;
    poster: string;
    ano: number;
    nacionalidade: string;
}