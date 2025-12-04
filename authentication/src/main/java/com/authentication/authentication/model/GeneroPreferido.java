package com.authentication.authentication.model;

public enum GeneroPreferido {
    ACAO("Ação"),
    AVENTURA("Aventura"),
    COMEDIA("Comédia"),
    DRAMA("Drama"),
    FICCAO_CIENTIFICA("Ficção Científica"),
    TERROR("Terror"),
    SUSPENSE("Suspense"),
    ANIMACAO("Animação"),
    DOCUMENTARIO("Documentário"),
    ROMANCE("Romance"),
    FANTASIA("Fantasia");

    private final String label;

    GeneroPreferido(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
