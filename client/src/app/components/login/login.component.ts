import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { Field, form } from '@angular/forms/signals'
import { LoginRequest } from "../../models/auth/LoginRequest.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    imports: [Field],
    templateUrl: `login.component.html`
})
export class LoginComponent {
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);

    loginModel = signal<LoginRequest>({
        username: '',
        password: ''
    })

    loginForm = form(this.loginModel)

    login() {
        if (this.loginForm().valid()) {
            const req = this.loginModel();
            this._authService.login(req).subscribe({
                next: (token) => {
                    console.log('Logado com sucesso:', token);
                    this._router.navigate(['/']);
                },
                error: (err) => {
                    console.log('Erro no login:', err);
                }
            });
        } else {
            return;
        }
    }
}