import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { authGuard } from './services/auth/auth.guard';
import { BoasVindasDeslogadoComponent } from './components/boas-vindas-deslogado/boas-vindas-deslogado.component';
import { BoasVindasLogadoComponent } from './components/boas-vindas-logado/boas-vindas-logado.component';
import { DetalheFilmeComponent } from './components/detalhe-filme/detalhe-filme.component';
import { ListaFilmeComponent } from './components/lista-filme/lista-filme.component';
import { AtualizarFilmeComponent } from './components/atualizar-filme/atualizar-filme.component';
import { NotificacoesComponent } from './components/notificacoes/notificacoes.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent},
    { path: '', component: BoasVindasDeslogadoComponent},
    { path: 'home', component: BoasVindasLogadoComponent, canActivate: [authGuard]},
    { path: 'filmes', component: ListaFilmeComponent, canActivate: [authGuard]},
    { path: 'filmes/:id', component: DetalheFilmeComponent, canActivate: [authGuard]},
    { path: 'filmes/:id/atualizar', component: AtualizarFilmeComponent, canActivate: [authGuard]},
    { path: 'notificacoes', component: NotificacoesComponent, canActivate: [authGuard]},
];
