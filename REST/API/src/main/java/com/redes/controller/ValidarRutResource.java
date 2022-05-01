package com.redes.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.Locale;

import com.redes.model.ErrorModel;
import com.redes.model.ValidadorRutModel;

@Path("/validar")
public class ValidarRutResource {
    @GET
    @Produces("application/json")
    public Response validar(@QueryParam("rut") String rut, @QueryParam("dv") String dv) {
        int parsed_rut;
        char parsed_dv;

        try {
            parsed_rut = Integer.parseInt(rut);
            parsed_dv = dv.toUpperCase(Locale.ROOT).charAt(0);
        }
        catch (NumberFormatException e) {
            return Response.status(400).entity(new ErrorModel("El rut debe ser un numero entero")).build();
        }
        catch(NullPointerException | StringIndexOutOfBoundsException e) {
            return Response.status(400).entity(new ErrorModel("Debes enviar dos parametros en una petición GET. 'rut': numero entero. 'dv': caracter")).build();
        }

        ValidadorRutModel res = new ValidadorRutModel(parsed_rut, parsed_dv);

        return Response.ok(res).build();
    }
}
