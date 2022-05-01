let API = "";

(async () => {
    try {
        const { HOST, PORT, UBICACION } = await fetch('config.json')
            .then((response) => response.json());
        if(HOST == undefined || PORT == undefined || UBICACION == undefined){ 
            return show_error("Uno o más de los parámetros de ubicación de la API no han sido definidos. Revise 'config.json'.")
        }
        API = `http://${HOST}:${PORT}${UBICACION}/index.php/`;
    }
    catch (Error) {
        return show_error("No se ha encontrado el archivo de configuracion 'config.json'")
    }
})();

function show_error(message) {
    document.querySelector('#success').classList.add('hidden');
    const errordiv = document.querySelector('#error');

    errordiv.querySelector('p').innerText = message;
    errordiv.classList.remove('hidden');
}

function onSOAPError(SOAPResponse) {
    const errorMessage = SOAPResponse.toJSON().Body.Fault.faultstring.toString();

    show_error(errorMessage);
}

function enviar_validar_rut() {
    if (API === "") return;

    const rut_input = document.querySelector('#rut').value;
    const dv_input = document.querySelector('#dv').value;

    $.soap({
        url: API,
        method: 'validarDigitoVerificador',

        data: { rut: rut_input, dv: dv_input },

        success: function (soapResponse) {
            const { rut, dv, valido } = soapResponse.toJSON().Body.validarDigitoVerificadorResponse;

            console.log(rut, dv,)

            document.querySelector('#error').classList.add('hidden');
            const success = document.querySelector("#success");

            success.classList.remove('hidden');

            if (valido.toString() === 'true') {
                success.querySelector('p').innerText = `
                        El Digito verificador ${dv.toString()} si es válido para tu RUT, Hurra!
                    `;
            }
            else {
                success.querySelector('p').innerText = `
                        El Digito verificador ${dv.toString()} no es valido para el rut ${rut.toString()}
                    `;
            }
        },
        error: onSOAPError,
    }
    )
}

function enviar_separador_nombres() {
    if (API === "") return;

    const nombresInput = document.querySelector('#nombres').value;

    $.soap({
        url: API,
        method: 'separarNombres',

        data: { name: nombresInput },

        success: function (soapResponse) {
            const { nombres, apellidos } = soapResponse.toJSON().Body.separarNombresResponse;

            document.querySelector('#error').classList.add('hidden');
            const success = document.querySelector("#success");

            success.classList.remove('hidden');

            success.querySelector('#apellidos').innerHTML = `
                <li>Paterno: ${apellidos.paterno}</li>
                <li>Materno: ${apellidos.materno}</li>
            `

            const _nombres = success.querySelector('#nombres');

            _nombres.innerHTML = '';

            nombres.item.toString().split(',').forEach(nombre => {
                _nombres.innerHTML += `<li>${nombre}</li>`;
            });
        },

        error: onSOAPError,
    })
}
