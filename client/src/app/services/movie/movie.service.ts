import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { MovieRequest } from "../../models/movie/MovieRequest.model";
import { MovieResponse } from "../../models/movie/MovieResponse.model";
import { StatusResponse } from "../../models/movie/StatusResponse.model";
import { LikeResponse } from "../../models/movie/LikeResponse.model";
import { environment } from "../../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private readonly _httpClient = inject(HttpClient);

    inserir(req: MovieRequest): Observable<MovieResponse> {
        return this._httpClient.post<MovieResponse>(`${environment.apiUrl}/movies`, req);
    }

    atualizar(id: number, req: MovieRequest): Observable<MovieResponse> {
        return this._httpClient.put<MovieResponse>(`${environment.apiUrl}/movies/${id}`, req);
    }

    deletar(id: number) {
        return this._httpClient.delete<void>(`${environment.apiUrl}/movies/${id}`);
    }

    getById(id: number): Observable<MovieResponse> {
        return this._httpClient.get<MovieResponse>(`${environment.apiUrl}/movies/${id}`);
    }

    listar(params: {
        nome?: string;
        diretor?: string;
        genero?: string;
        nacionalidade?: string;
        ano?: number;
        duracao?: number;
        favorito?: boolean;
        idUsuario?: number;
    }): Observable<MovieResponse[]> {
        return this._httpClient.get<MovieResponse[]>(`${environment.apiUrl}/movies`, { params });
    }

    favoritar(id: number, favorito: boolean): Observable<MovieResponse> {
        return this._httpClient.patch<MovieResponse>(`${environment.apiUrl}/movies/${id}/favorito`, null, { params: { favorito }});
    }

    curtir(id: number): Observable<StatusResponse> {
        return this._httpClient.post<StatusResponse>(`${environment.apiUrl}/movies/${id}/like`, {});
    }

    descurtir(id: number): Observable<StatusResponse> {
        return this._httpClient.delete<StatusResponse>(`${environment.apiUrl}/movies/${id}/like`);
    }

    listarCurtidas(id: number): Observable<LikeResponse[]> {
        return this._httpClient.get<LikeResponse[]>(`${environment.apiUrl}/movies/${id}/likes`);
    }
}