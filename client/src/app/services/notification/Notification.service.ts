import { effect, Injectable, signal } from '@angular/core';
import { NotificationSocketService } from './NotificationSocket.service';
import { Notificacao } from '../../models/notificacao/notificacao.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    notificacoes = signal<Notificacao[]>([]);
    naoLidas = signal(0);

    constructor(private ws: NotificationSocketService) { }

    iniciar(usuarioId: number) {
        const socket = this.ws.connect(usuarioId);

        this.ws.onMessage((msg) => {
            const nova = {
                ...msg,
                lida: false
            };

            this.notificacoes.update(lista => [nova, ...lista]);
            this.naoLidas.update(n => n + 1);
        });
    }

    marcarComoLidas() {
        this.notificacoes.update(lista =>
            lista.map(n => ({ ...n, lida: true }))
        );
        this.naoLidas.set(0);
    }
}
