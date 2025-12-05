import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserResponse } from "../../models/user/UserResponse.model";
import { environment } from "../../../environment/environment";
import { UserRequest } from "../../models/user/UserRequest.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly _httpClient = inject(HttpClient);

    pegar(id: number): Observable<UserResponse> {
        return this._httpClient.get<UserResponse>(`${environment.apiUrl}/users/${id}`);
    }

    listar(): Observable<UserResponse[]> {
        return this._httpClient.get<UserResponse[]>(`${environment.apiUrl}/users`);
    }

    atualizar(req: UserRequest, id: number): Observable<UserResponse> {
        return this._httpClient.put<UserResponse>(`${environment.apiUrl}/users/${id}`, req);
    }

    deletar(id: number): void {
        this._httpClient.delete<void>(`${environment.apiUrl}/users/${id}`);
    }
}