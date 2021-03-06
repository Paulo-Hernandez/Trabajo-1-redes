package com.redes.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.redes.AppLogger;
import com.redes.model.ErrorModel;
import com.redes.model.ValidadorRutModel;

@Path("/validar")
public class ValidarRutResource {
    private static final Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    public ValidarRutResource() {
        AppLogger.setup();
    }

    @GET
    @Produces("application/json")
    public Response validar(@QueryParam("rut") String rut, @QueryParam("dv") String dv) {
        int parsedRUT;
        char parsedDV;

        try {
            parsedRUT = Integer.parseInt(rut);
            parsedDV = dv.toUpperCase(Locale.ROOT).charAt(0);
        } catch (NumberFormatException e) {
            if (LOGGER.isLoggable(Level.WARNING)) {
                LOGGER.warning(String.format("[GET] '/valida': Request con un RUT Invalido: %s", rut));
            }

            return Response.status(400).entity(new ErrorModel("El rut debe ser un numero entero")).build();
        } catch (NullPointerException | StringIndexOutOfBoundsException e) {
            if (LOGGER.isLoggable(Level.WARNING)) {
                LOGGER.warning(String.format("[GET] '/validar': Request con un dv invalido: %s", dv));
            }

            return Response.status(400)
                    .entity(new ErrorModel(
                            "Debes enviar dos parametros en una petición GET. 'rut': numero entero. 'dv': caracter"))
                    .build();
        }

        ValidadorRutModel res = new ValidadorRutModel(parsedRUT, parsedDV);

        return Response.ok(res).build();
    }
}
