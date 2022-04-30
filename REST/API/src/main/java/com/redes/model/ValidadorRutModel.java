package com.redes.model;

import java.io.Serializable;

public class ValidadorRutModel implements Serializable {
    private int rut;
    private char dv;
    private final boolean esValido;

    public ValidadorRutModel(int rut, char dv) {
        super();
        this.rut = rut;
        this.dv = dv;

        this.esValido = this.validar();
    }

    private boolean validar() {
        int aux = this.rut;
        int m = 0, s = 1;

        for(; aux != 0; aux /= 10){
            s = (s + aux % 10 * (9 - m++ % 6)) % 11;
        }

        return this.dv == (char) (s != 0 ? s + 47 : 75);
    }

    public boolean esValido() {
        return this.esValido;
    }
}
