import { Component, EventEmitter, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NotificationService } from "../../services/notification/Notification.service";

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink],
    templateUrl: `sidebar.component.html`,
})
export class SidebarComponent {
    @Output() abrirFormulario = new EventEmitter<void>();

    idLogado = Number(sessionStorage.getItem('id_usuario'));

    constructor(public notif: NotificationService) {}

    abrirForm() {
        this.abrirFormulario.emit();
    }
}