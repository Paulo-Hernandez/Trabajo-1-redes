<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, SOAPAction');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once "vendor/econea/nusoap/src/nusoap.php";
$servicio = new soap_server();

$ns = "urn:miserviciowsdl";
$servicio->configureWSDL("ServicioWebSoap", $ns);
$servicio->schemaTargetNamespace = $ns;

// $servicio->wsdl->addComplexType(
//     'Nombres',
//     'ComplexType',
//     'array',
//     '',
//     array(
//         'Nombre' => array(
//             'name' => 'Nombre',
//             'type' => 'xsd:string',
//             'minOccurs' => '0',
//             'maxOccurs' => 'unbounded'
//         )
//     )
// );

$servicio->wsdl->addComplexType(
    'Apellidos',
    'complexType',
    'struct',
    'sequence',
    '',
    array(
        'paterno' => array('name' => 'paterno', 'type' => 'xsd:string'),
        'materno' => array('name' => 'materno', 'type' => 'xsd:string')
    )
);

$servicio->register(
    "validarDigitoVerificador",
    array('rutSinDigito' => 'xsd:string', 'digitoVerificador' => 'xsd:string'),
    array('return' => 'xsd:boolean'), 
    $ns
);

$servicio->register(
    'separarNombres',
    array('input' => 'xsd:string'),
    array('nombres' => 'SOAP-ENC:Array', 'apellidos' => 'tns:Apellidos'),
    $ns
);


function validarDigitoVerificador($rutSinDigito, $digitoVerificador) {
    if(!is_numeric($rutSinDigito)){
        return new soap_fault(
            '3',
            '',
            'El RUT debe ser un numero entero',
            ''
        );
    }

    $s = 1;
    for($m = 0; $rutSinDigito != 0; $rutSinDigito /= 10){
        $s = ($s + $rutSinDigito % 10 * (9 - $m++ % 6)) % 11;
    }
    $aux = chr($s ? $s + 47 : 75);

    return $aux == $digitoVerificador;
}

function separarNombres($input){
    $nombres = array();
    $apellidos = array();

    $aux = explode(" ", $input);

    if(count($aux) < 3) {
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
