import { Component, inject, signal } from "@angular/core";
import { UserService } from "../../services/user/user.servive";
import { ActivatedRoute, Router } from "@angular/router";
import { UserRequest } from "../../models/user/UserRequest.model";
import { Genero } from "../../models/movie/MovieRequest.model";
import { Field, form, minLength, required } from "@angular/forms/signals";

@Component({
    selector: 'app-atualizar-usuario',
    imports: [Field],
    templateUrl: `atualizar-usuario.component.html`
})
export class AtualizarUsuarioComponent {
    private readonly _usuarioService = inject(UserService);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    usuario = signal<UserRequest | null>(null);
    Genero = Genero;

    generosSelecionados = signal<string[]>([]);
    userModel = signal<UserRequest>({
        username: '',
        email: '',
        descricao: '',
        fotoPerfilUrl: '',
        fotoBannerUrl: '',
    });

    userForm = form(this.userModel, (u) => {
        required(u.username);
        required(u.email);
        required(u.descricao);
        required(u.fotoPerfilUrl);
        required(u.fotoBannerUrl);
    })

    ngOnInit() {
        const id = Number(this._route.snapshot.paramMap.get('id'));

        if (id) {
            this.resgatarUsuario(id);
        }
    }

    onGeneroChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const valores = Array.from(select.selectedOptions).map(opt => opt.value);
        this.generosSelecionados.set(valores);
    }

    resgatarUsuario(id: number) {
        this._usuarioService.pegar(id).subscribe({
            next: (data: any) => {
                const usuario = data;
                console.log("resgatado com sucesso", usuario);
                this.usuario.set(usuario);

                const u = this.usuario();
                if (u) {
                    this.userModel.set({
                        username: u.username,
                        email: u.email,
                        descricao: u.descricao,
                        fotoPerfilUrl: u.fotoPerfilUrl,
                        fotoBannerUrl: u.fotoBannerUrl,
                    })
                    this.generosSelecionados.set(usuario.generosPreferidos ?? []);
                }
            },
            error: (err) => {
                console.log("erro na recuperação:", err);
            }
        });
    }

    atualizar() {
        if (this.userForm().valid()) {
            const req = this.userModel();
            const id = Number(this._route.snapshot.paramMap.get('id'));

            if (id) {
                this._usuarioService.atualizar(req, id, this.generosSelecionados()).subscribe({
                    next: (data: any) => {
                        console.log('atualizado', data);
                        this._router.navigate(['/usuarios/', id]);
                    },
                    error: (err) => {
                        console.log('Erro na atualização:', err);
                    }
                })
            }
        }
    }

    voltar() {
        this._router.navigate(['../home']);
    }
}