export interface Notificacao {
    id: string;                 // backend gera string
    destinatarioId: number;
    criadorId: number;          // quem criou o evento (curtiu ou criou filme)
    filmeId: number;
    tipo: "FILME_CRIADO" | "FILME_CURTIDO";
    broadcast: boolean;
    lido: boolean;
    createdAt: string;          // convertido para string em JSON
}
