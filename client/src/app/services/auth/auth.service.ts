import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { UserResponse } from "../../models/auth/UserResponse.model";
import { RegisterRequest } from "../../models/auth/RegisterRequest.model";
import { TokenResponse } from "../../models/auth/TokenResponse.model";
import { LoginRequest } from "../../models/auth/LoginRequest.model";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { environment } from "../../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _httpClient = inject(HttpClient);

    register(req: RegisterRequest): Observable<UserResponse> {
        return this._httpClient.post<UserResponse>(`${environment.apiUrl}/auth/register`, req);
    }

    login(req: LoginRequest): Observable<TokenResponse> {
        return this._httpClient.post<TokenResponse>(`${environment.apiUrl}/auth/login`, req)
        .pipe(
            tap((response) => {
                sessionStorage.setItem('token', response.token);
            })
        );
    }

    estaAutenticado() {
        return this.tokenDeAutenticacao() !== null;
    }

    tokenDeAutenticacao(): string | null {
        return sessionStorage.getItem('token');
    }

    getExpiracaoToken(): number | null {
        const token = this.tokenDeAutenticacao();
        if (!token) return null;

        try {
            const decodificado = jwtDecode<JwtPayload>(token);
            return decodificado.exp ? decodificado.exp * 1000 : null;
        } catch (e) {
            console.log("Não foi possivel decodificar o jwt: " + e);
            return null;
        }
    }

    tokenEstaExpirado(): boolean {
        const expiracao = this.getExpiracaoToken();
        if (!expiracao) return true;

        return expiracao < Date.now();
    }
}