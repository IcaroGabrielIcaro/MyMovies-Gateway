import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CriarFilmeComponent } from './components/criar-filme/criar-filme.component';
import { NotificationService } from './services/notification/Notification.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    CriarFilmeComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly _notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  isLogged = signal<boolean>(false);
  showMovieForm = false;

  ngOnInit() {
    this.isLogged.set(!!sessionStorage.getItem('token'));

    const idUsuario = Number(sessionStorage.getItem('id_usuario'));

    if (idUsuario) {
      this._notificationService.iniciar(idUsuario);
    }
  }

  abrirModal() {
    this.showMovieForm = true;
  }

  fecharModal() {
    this.showMovieForm = false;
  }
}
