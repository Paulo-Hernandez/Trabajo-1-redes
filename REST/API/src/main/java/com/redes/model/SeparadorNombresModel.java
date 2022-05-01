package com.redes.model;

import java.io.Serializable;
import java.util.List;

public class SeparadorNombresModel implements Serializable {
    private class Apellidos implements Serializable {
        private String paterno;
        private String materno;

        public Apellidos(String paterno, String materno) {
            super();
            this.paterno = paterno;
            this.materno = materno;
        }

        public String getMaterno() {
            return materno;
        }

        public String getPaterno() {
            return paterno;
        }
    }

    private List<String> nombres;
    private Apellidos apellidos;

    public SeparadorNombresModel(List<String> nombres, String paterno, String materno) {
        super();
        this.nombres = nombres;
        this.apellidos = new Apellidos(paterno, materno);
    }

    public Apellidos getApellidos() {
        return apellidos;
    }

    public List<String> getNombres() {
        return nombres;
    }
}
