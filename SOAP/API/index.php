<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, SOAPAction');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require __DIR__ . '/vendor/autoload.php';
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

require_once "vendor/econea/nusoap/src/nusoap.php";
$servicio = new soap_server();

$ns = "urn:miserviciowsdl";
$servicio->configureWSDL("ServicioWebSoap", $ns);
$servicio->schemaTargetNamespace = $ns;

define("XMLSTRING", "xsd:string");

$servicio->wsdl->addComplexType(
    'Apellidos',
    'complexType',
    'struct',
    'sequence',
    '',
    array(
        'paterno' => array('name' => 'paterno', 'type' => XMLSTRING),
        'materno' => array('name' => 'materno', 'type' => XMLSTRING)
    )
);

$servicio->register(
    "validarDigitoVerificador",
    array('rutSinDigito' => XMLSTRING, 'digitoVerificador' => XMLSTRING),
    array('rut' => XMLSTRING, 'dv' => XMLSTRING, 'valido' => 'xsd:boolean'), 
    $ns
);

$servicio->register(
    'separarNombres',
    array('input' => XMLSTRING),
    array('nombres' => 'SOAP-ENC:Array', 'apellidos' => 'tns:Apellidos'),
    $ns
);


function validarDigitoVerificador($rutSinDigito, $digitoVerificador) {
    $log = new Logger("SOAP");
    $log->pushHandler(new StreamHandler(__DIR__ . "/logs/actions.log", Logger::WARNING));

    $log->info("[ACTION]: 'validarDigitoVerificador'; [rut]: $rutSinDigito; [dv]: $digitoVerificador");
    $rutcopia = $rutSinDigito;
    
    if(!is_numeric($rutSinDigito)){
        $log->warning("[ACTION]: 'validarDigitoVerificador' - Bad input");
        $log->warning("Se intentó utilizar un RUT inválido. [rut]: $rutSinDigito");

        return new soap_fault(
            '3',
            '',
            'El RUT debe ser un numero entero',
            ''
        );
    }

    if(strlen($digitoVerificador) != 1) {
        $log->warning("[ACTION]: 'validarDigitoVerificador' - Bad input");
        $log->warning("Se intentó utilizar un DV inválido. [dv]: $digitoVerificador");

        return new soap_fault(
            '3',
            '',
            'El Digito verificador debe ser un unico caracter',
            ''
        );
    }

    $s = 1;
    $m = 0;
    for(; $rutSinDigito != 0; $rutSinDigito /= 10){
        $s = ($s + $rutSinDigito % 10 * (9 - $m % 6)) % 11;
        $m += 1;
    }
    $aux = chr($s ? $s + 47 : 75);

    return [
        'rut' => $rutcopia,
        'dv' => $digitoVerificador,
        'valido' => $aux == $digitoVerificador
    ];
}

function separarNombres($input){
    $log = new Logger("SOAP");
    $log->pushHandler(new StreamHandler(__DIR__ . "/logs/actions.log", Logger::WARNING));

    $log->info("[Action]: 'separarNombres'; [input]: $input");
    $nombres = array();
    $apellidos = array();

    $aux = explode(" ", $input);

    if(count($aux) < 3) {
        $log->warning("[ACTION]: 'separarNombres' - Bad input");
        $log->warning("Se intentó utilizar un input inválido. [input]: $input");

        return new soap_fault(
            '3',
            '',
            'Esta peticion necesita al menos 3 palabras separadas por espacios.',
            ''
        );
    }

    $apellidos['materno'] = array_pop($aux);
    $apellidos['paterno'] = array_pop($aux);

    $nombres = $aux;

    return compact('nombres', 'apellidos');
}

$servicio->service(file_get_contents("php://input"));
