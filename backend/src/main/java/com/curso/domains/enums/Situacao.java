package com.curso.domains.enums;

public enum Situacao {
    ABERTO(0,"Aberto"),
    BAIXADO(1,"Baixado");

    private final int id;
    private final String descricao;

    Situacao(int id, String descricao) { this.id = id; this.descricao = descricao; }

    public int getId() { return id; }
    public String getDescricao() { return descricao; }

    public static Situacao toEnum(Integer id) {
        if (id == null) return null;
        for (Situacao v : values()) if (v.id == id) return v;
        throw new IllegalArgumentException("Situação inválida: " + id);
    }

    public static Situacao fromString(String valor) {
        if (valor == null) return null;
        String x = valor.trim();

        try {
            int maybeId = Integer.parseInt(x);
            for (Situacao v : values()) if (v.id == maybeId) return v;
        } catch (NumberFormatException ignore) { }

        for (Situacao v : values()) {
            if (v.name().equalsIgnoreCase(x)) return v;
            if (v.getDescricao() != null && v.getDescricao().equalsIgnoreCase(x)) return v;
        }
        throw new IllegalArgumentException("Situação inválida: " + valor);
    }
}
