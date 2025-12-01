export interface Notificacao {
    id: number;
    tipo: string;
    curtidorId: number;
    filmeId: number;
    timestamp: string;
    lido: boolean;
}