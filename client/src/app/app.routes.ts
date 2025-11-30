import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent},
    { path: '', component: HomeComponent},
    { path: 'filmes', component: HomeComponent, canActivate: [authGuard]},
    { path: 'filmes/:id', component: HomeComponent, canActivate: [authGuard]},
];
