import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalCriarFilmeService);

  isLogged = this.authService.isLogged;
  showMovieForm = this.modalService.aberto;

  ngOnInit() {
    const idUsuario = Number(sessionStorage.getItem('id_usuario'));

    if (idUsuario) {
      this._notificationService.iniciar(idUsuario);
    }
  }

  abrirModal() {
    this.modalService.abrir();
  }

  fecharModal() {
    this.modalService.fechar();
  }
}
