package com.curso.domains.enums;

public enum TipoLancamento {
    CREDITO(0,"Credito"),
    DEBITO(1,"Debito");

    private final int id;
    private final String descricao;

    TipoLancamento(int id, String descricao) { this.id = id; this.descricao = descricao; }

    public int getId() { return id; }
    public String getDescricao() { return descricao; }

    public static TipoLancamento toEnum(Integer id) {
        if (id == null) return null;
        for (TipoLancamento v : values()) if (v.id == id) return v;
        throw new IllegalArgumentException("Tipo de Lançamento inválido: " + id);
    }

    public static TipoLancamento fromString(String valor) {
        if (valor == null) return null;
        String x = valor.trim();

        // aceita "0"/"1"
        try {
            int maybeId = Integer.parseInt(x);
            for (TipoLancamento v : values()) if (v.id == maybeId) return v;
        } catch (NumberFormatException ignore) { }

        // aceita name do enum e descrição
        for (TipoLancamento v : values()) {
            if (v.name().equalsIgnoreCase(x)) return v;
            if (v.getDescricao() != null && v.getDescricao().equalsIgnoreCase(x)) return v;
        }
        throw new IllegalArgumentException("Tipo de Lançamento inválido: " + valor);
    }
}
