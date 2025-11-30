import { Component, inject } from "@angular/core";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { BoasVindasDeslogadoComponent } from "../boas-vindas-deslogado/boas-vindas-deslogado.component";
import { BoasVindasLogadoComponent } from "../boas-vindas-logado/boas-vindas-logado.component";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { ListaFilmeComponent } from "../lista-filme/lista-filme.component";
import { CriarFilmeComponent } from "../criar-filme/criar-filme.component";
import { DetalheFilmeComponent } from "../detalhe-filme/detalhe-filme.component";
import { AtualizarFilmeComponent } from "../atualizar-filme/atualizar-filme.component";
import { NotificationSocketService } from "../../services/notification/NotificationSocket.service";
import { NotificationService } from "../../services/notification/Notification.service";
import { NotificacoesComponent } from "../notificacoes/notificacoes.component";

@Component({
    selector: 'app-home',
    imports: [
        SidebarComponent,
        BoasVindasDeslogadoComponent,
        BoasVindasLogadoComponent,
        ListaFilmeComponent,
        CriarFilmeComponent,
        DetalheFilmeComponent,
        AtualizarFilmeComponent,
        NotificacoesComponent
    ],
    templateUrl: `home.component.html`
})
export class HomeComponent {
    private readonly _socketService = inject(NotificationSocketService)

    isLogged = false;
    currentPath = '/';
    showMovieForm = false;

    constructor(private router: Router, private notif: NotificationService) {
        this.router.events.subscribe(() => {
            this.currentPath = this.router.url;
        });

        this.isLogged = !!sessionStorage.getItem('token');

        const idUsuario = Number(sessionStorage.getItem('id_usuario'));

        if (idUsuario) {
            this.notif.iniciar(idUsuario);
        }
    }

    ngOnInit() {
        this.currentPath = this.router.url;
        this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: NavigationEnd) => this.currentPath = e.urlAfterRedirects);
    }

    abrirModal() {
        this.showMovieForm = true;
    }

    fecharModal() {
        this.showMovieForm = false;
    }

    getIdFromPath(): number {
        const parts = this.currentPath.split('/');
        return Number(parts[2]);
    }
}