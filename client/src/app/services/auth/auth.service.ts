import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { UserResponse } from "../../models/user/UserResponse.model";
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

    private _token = signal<string | null>(sessionStorage.getItem('token'));
    isLogged = computed(() => !!this._token() && !this.tokenEstaExpirado());

    register(req: RegisterRequest): Observable<UserResponse> {
        return this._httpClient.post<UserResponse>(`${environment.apiUrl}/auth/register`, req);
    }

    login(req: LoginRequest): Observable<TokenResponse> {
        return this._httpClient.post<TokenResponse>(`${environment.apiUrl}/auth/login`, req)
            .pipe(
                tap((response) => {
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('id_usuario', response.userId.toString());

                    this._token.set(response.token);
                })
            );
    }

    logout() {
        sessionStorage.clear();
        this._token.set(null); // ✅ SIDEBAR SOME NA HORA
    }

    estaAutenticado() {
        return this._token();
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