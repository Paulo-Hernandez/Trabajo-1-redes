package com.redes.model;

import java.io.Serializable;

public class ErrorModel implements Serializable{
    private String message;

    public ErrorModel(String message){
        super();
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
