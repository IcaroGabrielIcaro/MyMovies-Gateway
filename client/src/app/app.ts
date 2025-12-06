import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CriarFilmeComponent } from './components/criar-filme/criar-filme.component';
import { NotificationService } from './services/notification/Notification.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { ModalCriarFilmeService } from './services/movie/modal-criar-filme.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    CriarFilmeComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly _notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalCriarFilmeService);

  isLogged = this.authService.isLogged;
  showMovieForm = this.modalService.aberto;;
  idUsuario = this.authService.userId;

  constructor() {
    effect(() => {
      const id = this.idUsuario()
      if (id) {
        this._notificationService.iniciar(id);
      }
    });
  }

  abrirModal() {
    this.modalService.abrir();
  }

  fecharModal() {
    this.modalService.fechar();
  }
}