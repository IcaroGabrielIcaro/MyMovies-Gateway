import { Component, inject, signal } from "@angular/core";
import { NotificationService } from "../../services/notification/Notification.service";
import { CardNotificacaoComponent } from "./card-notificacao.component";

@Component({
    selector: 'app-notificacao',
    imports: [CardNotificacaoComponent],
    templateUrl: `notificacoes.component.html`
})
export class NotificacoesComponent {
    protected readonly notif = inject(NotificationService);
    mainBannerUrl = signal<string>('https://image.tmdb.org/t/p/w500_and_h282_face/yQXfTbb5T4zVdZShGuPaZersiJc.jpg');
}