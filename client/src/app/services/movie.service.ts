import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MovieRequest } from "../models/movie/MovieRequest.model";
import { map, Observable } from "rxjs";
import { MovieResponse } from "../models/movie/MovieResponse.model";
import { StatusResponse } from "../models/movie/StatusResponse.model";
import { LikeResponse } from "../models/movie/LikeResponse.model";

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private readonly _httpClient = inject(HttpClient);

    inserir(req: MovieRequest): Observable<MovieResponse> {
        return this._httpClient
        .post<any>(`http://gateway-service/api/movie/`, req)
        .pipe(
            map(res => {
                const { _links, ...movie } = res;
                return movie as MovieResponse;
            })
        );
    }

    atualizar(id: number, req: MovieRequest): Observable<MovieResponse> {
        return this._httpClient
            .put<any>(`http://gateway-service/api/movie/${id}`, req)
            .pipe(
            map(res => {
                const { _links, ...movie } = res;
                return movie as MovieResponse;
            })
        );
    }

    deletar(id: number): Observable<{ message: string }> {
        return this._httpClient
            .delete<any>(`http://gateway-service/api/movie/${id}`)
            .pipe(
            map(res => {
                const { _links, ...body } = res;
                return body as { message: string };
            })
        );
    }

    getById(id: number): Observable<MovieResponse> {
        return this._httpClient
            .get<any>(`http://gateway-service/api/movie/${id}`)
            .pipe(
            map(res => {
                const { _links, ...movie } = res;
                return movie as MovieResponse;
            })
        );
    }

    listar(params: {
    nome?: string;
    diretor?: string;
    genero?: string;
    nacionalidade?: string;
    ano?: number;
    duracao?: number;
    favorito?: boolean;
    }): Observable<MovieResponse[]> {
        return this._httpClient
            .get<any>('http://gateway-service/api/movie', { params })
            .pipe(
            map(res => {
                const { _links, _embedded } = res;
                const items = _embedded?.movieResponseList || _embedded?.movies || [];

                return items.map((item: any) => {
                const { _links, ...movie } = item;
                return movie as MovieResponse;
                });
            })
        );
    }

    favoritar(id: number, favorito: boolean): Observable<MovieResponse> {
        return this._httpClient
            .patch<any>(`http://gateway-service/api/movie/${id}/favorito`, null, {
            params: { favorito }
            })
            .pipe(
            map(res => {
                const { _links, ...movie } = res;
                return movie as MovieResponse;
            })
        );
    }

    curtir(id: number): Observable<StatusResponse> {
        return this._httpClient.post<StatusResponse>(`http://gateway-service/api/movie/${id}/like`, {});
    }

    descurtir(id: number): Observable<StatusResponse> {
        return this._httpClient.delete<StatusResponse>(`http://gateway-service/api/movie/${id}/like`);
    }

    listarCurtidas(id: number): Observable<LikeResponse[]> {
        return this._httpClient.get<LikeResponse[]>(`http://gateway-service/api/movie/${id}/likes`);
    }
}