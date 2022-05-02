package com.redes;

import java.io.IOException;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

public class AppLogger {
    static private ConsoleHandler consola;

    static public void setup() throws IOException {
        Logger logger = Logger.getLogger(AppLogger.class.getName());
        logger.setLevel(Level.WARNING);
        consola = new ConsoleHandler();

        // create a TXT formatter
        logger.addHandler(consola);
    }
}
