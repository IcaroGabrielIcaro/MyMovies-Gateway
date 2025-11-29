import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export function authIntercept(
    req: HttpRequest<unknown>, 
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

    const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/api/auth/login',
        '/api/auth/register',
        '/usuarios'
    ];

    let pathname = req.url;
    try {
        pathname = new URL(req.url).pathname;
    } catch {
        pathname = req.url;
    }

    console.debug('[AuthIntercept] request url:', req.url, ' -> pathname:', pathname);

    if (publicPaths.some(p => pathname.includes(p) || req.url.includes(p))) {
        console.debug('[AuthIntercept] rota pública detectada, permitindo:', pathname);
        return next(req);
    }

    const servicoUsuario = inject(AuthService);

    if (servicoUsuario.tokenEstaExpirado()) {
        const router = inject(Router);
        router.navigate(['/login']); // Redirecionamento para a tela de login
        return new Observable<HttpEvent<unknown>>((observer) => {
            observer.complete();
        });
    }

    const token = sessionStorage.getItem('token');

    if (token) {
        const reqClonada = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(reqClonada);
    }

    return next(req);
}