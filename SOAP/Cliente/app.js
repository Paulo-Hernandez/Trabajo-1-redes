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

function enviar_validar_rut() {
    const rut_input = document.querySelector('#rut').value;
    const dv_input = document.querySelector('#dv').value;

    $.soap({
            url: API,
            method: 'validarDigitoVerificador',

            data: { rut: rut_input, dv: dv_input },
        
            success: function (soapResponse) {
                const {rut, dv, valido} = soapResponse.toJSON().Body.validarDigitoVerificadorResponse;

                console.log(rut, dv, )

                document.querySelector('#error').classList.add('hidden');
                const success = document.querySelector("#success");
                
                success.classList.remove('hidden');

                if(valido.toString() === 'true'){
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
            error: function (SOAPResponse) {
                const errorMessage = SOAPResponse.toJSON().Body.Fault.faultstring.toString();
    
                document.querySelector('#success').classList.add('hidden');
                const errordiv = document.querySelector('#error');
    
                errordiv.querySelector('p').innerText = errorMessage;
                errordiv.classList.remove('hidden');  
            },
        }
    )
}

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

            nombres.item.toString().split(',').forEach(nombre => {
                _nombres.innerHTML += `<li>${nombre}</li>`;
            });
        },

        error: function (SOAPResponse) {
            const errorMessage = SOAPResponse.toJSON().Body.Fault.faultstring.toString();

            document.querySelector('#success').classList.add('hidden');
            const errordiv = document.querySelector('#error');

            errordiv.querySelector('p').innerText = errorMessage;
            errordiv.classList.remove('hidden');  
        }
    })
}
