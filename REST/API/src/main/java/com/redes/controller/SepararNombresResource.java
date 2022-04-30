package com.redes.controller;

import com.redes.model.ErrorModel;
import com.redes.model.SeparadorNombresModel;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Stack;

@Path("/separador")
public class SepararNombresResource {
    @GET
    @Produces("application/json")
    public Response separar(@QueryParam("input") String input) {
        List<String> parsed_input;

        try{
            parsed_input = Arrays.asList(input.split(" "));
        }
        catch(NullPointerException e){
            return Response.status(400).entity(new ErrorModel("Hacen falta parámetros GET. 'input': String. Deben ser 3 palabras separadas por espacios.")).build();
        }

        if(parsed_input.size() < 3) {
            return Response.status(400).entity(new ErrorModel("Son necesarias al menos 3 palabras separadas por espacios")).build();
        }

        Stack<String> pila_inputs = new Stack<>();

        pila_inputs.addAll(parsed_input);

        String materno = pila_inputs.pop();
        String paterno = pila_inputs.pop();

        List<String> listaNombres = new ArrayList<>(pila_inputs);

        SeparadorNombresModel res = new SeparadorNombresModel(listaNombres, paterno, materno);

        return Response.ok(res).build();
    }
}
