import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserResponse } from "../models/auth/UserResponse.model";
import { RegisterRequest } from "../models/auth/RegisterRequest.model";
import { TokenResponse } from "../models/auth/TokenResponse.model";
import { LoginRequest } from "../models/auth/LoginRequest.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _httpClient = inject(HttpClient);

    register(req: RegisterRequest): Observable<UserResponse> {
        return this._httpClient.post<UserResponse>(`http://gateway-service/api/auth/register`, req);
    }

    login(req: LoginRequest): Observable<TokenResponse> {
        return this._httpClient.post<TokenResponse>(`http://gateway-service/api/auth/login`, req);
    }
}