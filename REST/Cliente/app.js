const API = 'http://localhost:8080/demo-1.0-SNAPSHOT/api';

function enviar_validar_rut() {
    const uri = API + '/validar';

    const rut_input = document.querySelector('#rut').value;
    const dv_input = document.querySelector('#dv').value;

    fetch(uri + '?' + new URLSearchParams({
        rut: rut_input,
        dv: dv_input,
    }))
    .then((response) => response.json())
    .then((data) => console.log(data));
}