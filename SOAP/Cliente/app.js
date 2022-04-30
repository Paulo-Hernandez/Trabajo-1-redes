document.addEventListener('DOMContentLoaded', () => {
    $.soap({
        url: 'http://localhost:8000/index.php/',
        method: 'separarNombres',

        data: { name: 'Remy Blom Marti' },

        success: function (soapResponse) {
            // do stuff with soapResponse
            // if you want to have the response as JSON use soapResponse.toJSON();
            // or soapResponse.toString() to get XML string
            // or soapResponse.toXML() to get XML DOM

            console.log(soapResponse.toJSON().Body);
        },
        error: function (SOAPResponse) {
            // show error

            console.log(SOAPResponse.toJSON());
        }
    });
});
