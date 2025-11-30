import { Component } from "@angular/core";
import { NotificationService } from "../../services/notification/Notification.service";

@Component({
    selector: 'app-notificacao',
    imports: [],
    templateUrl: `notificacoes.component.html`
})
export class NotificacoesComponent {
    constructor(public notif: NotificationService) {
        notif.marcarComoLidas();
    }
}