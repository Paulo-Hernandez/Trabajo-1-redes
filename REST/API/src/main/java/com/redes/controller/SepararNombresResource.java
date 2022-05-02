package com.redes.controller;

import com.redes.AppLogger;
import com.redes.model.ErrorModel;
import com.redes.model.SeparadorNombresModel;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;

@Path("/separador")
public class SepararNombresResource {
    private final static Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    public SepararNombresResource() {
        try {
            AppLogger.setup();
        }
        catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Problems with creating log files");
        }
    }

    @GET
    @Produces("application/json")
    public Response separar(@QueryParam("input") String input) {
        List<String> parsedInput;

        try{
            parsedInput = Arrays.asList(input.split(" "));
        }
        catch(NullPointerException e){
            LOGGER.warning("[GET] '/separador': Request sin valor para 'input'.");

            return Response.status(400).entity(new ErrorModel("Hacen falta parámetros GET. 'input': String. Deben ser 3 palabras separadas por espacios.")).build();
        }

        if(parsedInput.size() < 3) {
            LOGGER.warning("[GET] '/separador': Request con valor invalido para 'input: " + input);

            return Response.status(400).entity(new ErrorModel("Son necesarias al menos 3 palabras separadas por espacios")).build();
        }

        Deque<String> pilaInputs = new LinkedList<>();

        pilaInputs.addAll(parsedInput);

        String materno = pilaInputs.pop();
        String paterno = pilaInputs.pop();

        List<String> listaNombres = new ArrayList<>(pilaInputs);

        SeparadorNombresModel res = new SeparadorNombresModel(listaNombres, paterno, materno);

        return Response.ok(res).build();
    }
}
