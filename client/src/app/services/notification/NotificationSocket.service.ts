import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class NotificationSocketService {
    private socket!: WebSocket;
    public connected = signal(false);

    connect(usuarioId: number) {
        if (!usuarioId) return;

        this.socket = new WebSocket(`ws://localhost:3003/?usuarioId=${usuarioId}`);

        this.socket.onopen = () => this.connected.set(true);
        this.socket.onclose = () => this.connected.set(false);

        return this.socket;
    }

    onMessage(callback: (msg: any) => void) {
        if (!this.socket) return;

        this.socket.onmessage = (event) => {
            callback(JSON.parse(event.data));
        };
    }
}