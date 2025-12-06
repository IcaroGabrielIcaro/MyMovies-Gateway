import { inject, Injectable, signal } from '@angular/core';
import { NotificationSocketService } from './NotificationSocket.service';
import { Notificacao } from '../../models/notificacao/notificacao.model';
import { HttpClient } from '@angular/common/http';
import { notificationEnvironment } from '../../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly ws = inject(NotificationSocketService);
    private readonly http = inject(HttpClient);

    notificacoes = signal<Notificacao[]>([]);
    naoLidas = signal(0);

    iniciar(usuarioId: number) {
        // 1) Buscar notificações persistidas
        this.http.get<Notificacao[]>(`${notificationEnvironment.apiUrl}/api/notifications/${usuarioId}`)
            .subscribe(lista => {
                this.notificacoes.set(lista);
                this.naoLidas.set(lista.filter(n => !n.lido).length);
            });

        // 2) Abrir WebSocket
        this.ws.connect(usuarioId);

        // 3) Quando chegar notificação em tempo real
        this.ws.onMessage(msg => {
            const nova = { ...msg, lido: false };

            this.notificacoes.update(lista => [nova, ...lista]);
            this.naoLidas.update(n => n + 1);
        });
    }

    marcarComoLida(id: string) {
        this.http.post(`${notificationEnvironment.apiUrl}/api/notifications/${id}/read`, {})
            .subscribe(() => {
                this.notificacoes.update(lista =>
                    lista.map(n => n.id === id ? { ...n, lido: true } : n)
                );

                this.naoLidas.set(
                    this.notificacoes().filter(n => !n.lido).length
                );
            });
    }

    marcarTodasComoLidas() {
        this.notificacoes.update(lista => lista.map(n => ({ ...n, lido: true })));
        this.naoLidas.set(0);
    }
}
