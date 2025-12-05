import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ModalCriarFilmeService {
    aberto = signal<boolean>(false);

    abrir() {
        this.aberto.set(true);
    }

    fechar() {
        this.aberto.set(false);
    }
}