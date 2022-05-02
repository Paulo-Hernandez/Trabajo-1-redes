package com.redes;

import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

public class AppLogger {
    private AppLogger() {
        throw new IllegalStateException("Utility class");
    }

    
    public static void setup() {
        ConsoleHandler consola;
        Logger logger = Logger.getLogger(AppLogger.class.getName());
        logger.setLevel(Level.WARNING);
        consola = new ConsoleHandler();

        // create a TXT formatter
        logger.addHandler(consola);
    }
}
