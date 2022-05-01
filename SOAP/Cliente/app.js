const API = 'http://localhost:8000/index.php/';

// document.addEventListener('DOMContentLoaded', () => {
//     $.soap({
//         url: 'http://localhost:8000/index.php/',
//         method: 'separarNombres',

//         data: { name: 'Blom Marti' },

//         success: function (soapResponse) {
//             const {nombres, apellidos} = soapResponse.toJSON().Body.separarNombresResponse;

//         },
//         error: function (SOAPResponse) {
//             // show error
//             const errorMessage = SOAPResponse.toJSON().Body.Fault.faultstring.toString();
//             console.log(errorMessage);
//         }
//     });
// });

function enviar_separador_nombres() {
    const nombres = document.querySelector('#nombres').value;

    $.soap({
        url: API,
        method: 'separarNombres',

        data: { name: nombres },

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

            if (typeof nombres.item === Array) {
                nombres.item.forEach(nombre => {
                    _nombres.innerHTML += `<li>${nombre}</li>`;
                });
            }
            else {
                _nombres.innerHTML += `<li>${nombres.item}</li>`;
            }


        },

        error: function (SOAPResponse) {
            const errorMessage = SOAPResponse.toJSON().Body.Fault.faultstring.toString();

        }
    })
}
