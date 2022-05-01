const API = 'http://localhost:8080/demo-1.0-SNAPSHOT/api';

function enviar_validar_rut() {
    const uri = API + '/validar';

    const rut_input = document.querySelector('#rut').value;
    const dv_input = document.querySelector('#dv').value;

    fetch(uri + '?' + new URLSearchParams({
        rut: rut_input,
        dv: dv_input,
    }))
    .then(async (response) => {
        if (!response.ok) {
            throw Error(
                await response.json().then((error) => error.message)
            );
        }
        return response.json();
    })
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
    .catch((error) => {
        document.querySelector('#success').classList.add('hidden');
        const errordiv = document.querySelector('#error');

        errordiv.querySelector('p').innerText = error;
        errordiv.classList.remove('hidden');
    })
}

function enviar_separador_nombres() {
    const uri = API + '/separador';

    const nombres = document.querySelector('#nombres').value;

    fetch(uri + '?' + new URLSearchParams({
        input: nombres,
    }))
    .then(async (response) => {
        if (!response.ok) {
            throw Error(
                await response.json().then((error) => error.message)
            );
        }
        return response.json();
    })
    .then((data) => {
        document.querySelector('#error').classList.add('hidden');
        const success = document.querySelector("#success");
        
        success.classList.remove('hidden');

        success.querySelector('#apellidos').innerHTML = `
            <li>Paterno: ${data.apellidos.paterno}</li>
            <li>Materno: ${data.apellidos.materno}</li>
        `

        const nombres = success.querySelector('#nombres');

        nombres.innerHTML = '';
        data.nombres.forEach(nombre => {
            nombres.innerHTML += `<li>${nombre}</li>`;
        });
    })
    .catch((error) => {
        document.querySelector('#success').classList.add('hidden');
        const errordiv = document.querySelector('#error');

        errordiv.querySelector('p').innerText = error;
        errordiv.classList.remove('hidden');    });
}