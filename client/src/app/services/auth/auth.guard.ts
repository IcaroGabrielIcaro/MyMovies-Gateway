import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
    console.log("Guard executado!");
    return inject(AuthService).estaAutenticado() 
    ? true 
    : inject(Router).createUrlTree(['/login']);
}