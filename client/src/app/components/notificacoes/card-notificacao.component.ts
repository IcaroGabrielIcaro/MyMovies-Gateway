import { Component, inject, Input } from "@angular/core";
import { Notificacao } from "../../models/notificacao/notificacao.model";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../services/notification/Notification.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-card-notificacao',
    imports: [DatePipe, RouterLink],
    template: `
        <div [routerLink]="['/filmes/', n.filmeId]" class="flex items-center justify-between gap-4 p-4 rounded-xl 
             bg-slate-900 shadow-lg cursor-pointer hover:bg-slate-800 transition">

            <div class="flex flex-col">
                <span class="text-sm font-bold text-white">
                    {{ gerarTexto(n) }}
                </span>

                <span class="text-xs opacity-60 text-white mt-1">
                    {{ n.createdAt | date:'short' }}
                </span>
            </div>

            <div class="shrink-0" (click)="$event.stopPropagation()">
                
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
        switch (n.tipo) {
            case "FILME_CURTIDO":
                return "Seu filme foi curtido!";
            case "FILME_CRIADO":
                return "Novo filme disponível no seu gênero favorito!";
            default:
                return "Nova notificação";
        }
    }
}