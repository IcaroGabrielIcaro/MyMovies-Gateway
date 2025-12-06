import { Injectable, signal } from "@angular/core";
import { notificationStartEnvironment } from "../../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class NotificationSocketService {
    private socket!: WebSocket;
    public connected = signal(false);

    connect(usuarioId: number) {
        const token = sessionStorage.getItem("token");

        const url = `${notificationStartEnvironment.apiUrl}/?usuarioId=${usuarioId}&token=${token}`;

        console.log("🔌 Conectando ao WebSocket:", url);

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("🟢 WebSocket conectado");
        };

        this.socket.onmessage = (event) => {
            console.log("📩 [NOTIFICAÇÃO RECEBIDA]:", event.data);
        };

        this.socket.onclose = () => {
            console.log("🔴 WebSocket desconectado");
        };

        this.socket.onerror = (err) => {
            console.error("⚠️ Erro no WebSocket:", err);
        };
    }

    onMessage(callback: (msg: any) => void) {
        if (!this.socket) return;

        this.socket.addEventListener("message", (event) => {
            try {
                callback(JSON.parse(event.data));
            } catch (_) { }
        });
    }
}
