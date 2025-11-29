import { Component, inject, signal } from "@angular/core";
import { Field, form } from "@angular/forms/signals";
import { AuthService } from "../../services/auth/auth.service";
import { RegisterRequest } from "../../models/auth/RegisterRequest.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-cadastro',
    imports: [Field],
    templateUrl: `cadastro.component.html`
})
export class CadastroComponent {
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);

    cadastroModel = signal<RegisterRequest>({
        username: '',
        email: '',
        password: ''
    })

    cadastroForm = form(this.cadastroModel)

    register() {
        if (this.cadastroForm().valid()) {
            const req = this.cadastroModel();
            this._authService.register(req).subscribe({
                next: (res) => {
                    console.log('Usuário criado!', res);
                    this._router.navigate(["/login"]);
                },
                error: (err) => {
                    console.log('Erro no cadastro:', err);
                }
            })
        } else {
            return;
        }
    }
}