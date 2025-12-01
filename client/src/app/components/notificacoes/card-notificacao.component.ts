import { Component, inject, Input } from "@angular/core";
import { Notificacao } from "../../models/notificacao/notificacao.model";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../services/notification/Notification.service";

@Component({
    selector: 'app-card-notificacao',
    imports: [DatePipe],
    template: `
        <div class="flex items-center justify-between gap-4 p-4 rounded-xl 
            bg-slate-900 shadow-lg cursor-pointer">

            <!-- TEXTO -->
            <div class="flex flex-col">
                <span class="text-sm font-bold text-white">
                    {{ gerarTexto(n) }}
                </span>

                <span class="text-xs opacity-60 text-white mt-1">
                    {{ n.timestamp | date:'short' }}
                </span>
            </div>

            <!-- STATUS -->
            <div class="shrink-0">
                @if (!n.lido) {
                <button (click)="notif.marcarComoLida(n.id)"
                    class="text-xs bg-blue-500 hover:bg-blue-400 
                        text-white px-3 py-1 rounded-full 
                        font-semibold transition">
                    Marcar como lida
                </button>
                }

                @if (n.lido) {
                <span class="text-xs opacity-60 text-white font-semibold">
                    Lida
                </span>
                }
            </div>
        </div>
    `
})
export class CardNotificacaoComponent {
    @Input() n!: Notificacao;
    protected readonly notif = inject(NotificationService);

    gerarTexto(n: Notificacao): string {
        const lista = [
            'Alguém curtiu um filme seu!'
            ]

        const index = Math.floor(Math.random() * lista.length);
        return lista[index];
    }
}