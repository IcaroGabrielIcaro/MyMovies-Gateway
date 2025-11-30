export enum Genero {
  Acao = 'acao',
  Aventura = 'aventura',
  Comedia = 'comedia',
  Drama = 'drama',
  Ficcao = 'ficcao',
  Terror = 'terror',
  Suspense = 'suspense',
  Animacao = 'animacao',
  Documentario = 'documentario',
  Romance = 'romance',
  Fantasia = 'fantasia',
}

export interface MovieRequest {
    nome: string;
    diretor: string;
    review: string;
    genero: Genero;

    nota: string;

    data_assistida: string;

    duracao: string;

    favorito: boolean;
    foto: string;
    poster: string;
    ano: string;
    nacionalidade: string;
}