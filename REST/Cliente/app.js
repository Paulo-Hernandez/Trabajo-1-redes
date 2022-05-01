let API = "";

(async () => {
    try {
        const { HOST, PORT, UBICACION } = await fetch('config.json')
            .then((response) => response.json());
        if(HOST == undefined || PORT == undefined || UBICACION == undefined){ 
            return show_error("Uno o más de los parámetros de ubicación de la API no han sido definidos. Revise 'config.json'.")
        }
        API = `http://${HOST}:${PORT}${UBICACION}/api`;
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

async function verificar_error(response) {
    if (!response.ok) {
        throw Error(
            await response.json().then((error) => error.message)
        );
    }
    return response.json();
}

function enviar_validar_rut() {
    if(API === "") return;
    const uri = API + '/validar';

    const rut_input = document.querySelector('#rut').value;
    const dv_input = document.querySelector('#dv').value;

    fetch(uri + '?' + new URLSearchParams({
        rut: rut_input,
        dv: dv_input,
    }))
    .then(verificar_error)
    .then((data) => {
        document.querySelector('#error').classList.add('hidden');
        const success = document.querySelector("#success");
        
        success.classList.remove('hidden');

        if(!data.valido){
            success.querySelector('p').innerText = `
                El Digito verificador ${data.dv} no es valido para el rut ${data.rut}
            `;
        }
        else {
            success.querySelector('p').innerText = `
                El Digito verificador ${data.dv} si es válido para tu RUT, Hurra!
            `;
        }
    })
    .catch((error) => show_error(error));
}

function enviar_separador_nombres() {
    const uri = API + '/separador';

    const nombres = document.querySelector('#nombres').value;

    fetch(uri + '?' + new URLSearchParams({
        input: nombres,
    }))
    .then(verificar_error)
    .then((data) => {
        document.querySelector('#error').classList.add('hidden');
        const success = document.querySelector("#success");
        
        success.classList.remove('hidden');

        success.querySelector('#apellidos').innerHTML = `
            <li>Paterno: ${data.apellidos.paterno}</li>
            <li>Materno: ${data.apellidos.materno}</li>
        `

        const nombresDiv = success.querySelector('#nombres');

        nombresDiv.innerHTML = '';
        data.nombres.forEach(nombre => {
            nombresDiv.innerHTML += `<li>${nombre}</li>`;
        });
    })
    .catch((error) => show_error(error));
}