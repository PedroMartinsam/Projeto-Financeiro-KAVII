package com.curso.domains.enums;

public enum PersonType {
    ADMIN(0, "ADMIN"),
    USER(1, "USER");

    private final Integer id;
    private final String personType;

    PersonType(Integer id, String personType) {
        this.id = id;
        this.personType = personType;
    }
    public Integer getId() { return id; }
    public String getPersonType() { return personType; }

    public static PersonType toEnum(Integer id) {
        if (id == null) return null;
        for (PersonType x : values()) if (id.equals(x.id)) return x;
        throw new IllegalArgumentException("Perfil inválido: " + id);
    }

    public static PersonType fromRole(String role) {
        if (role == null) return null;
        for (PersonType x : values()) {
            if (x.getPersonType().equalsIgnoreCase(role) || x.name().equalsIgnoreCase(role)) {
                return x;
            }
        }
        throw new IllegalArgumentException("Perfil inválido: " + role);
    }
}
