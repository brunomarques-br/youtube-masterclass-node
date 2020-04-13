const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');

const data = require('./urls.json');

function writeFile(callback) {
    fs.writeFile(
        path.join(__dirname, "urls.json"),
        JSON.stringify(data, null, 2),
        err => {

            if (err) throw err;

            callback(JSON.stringify({ message: "Successfull" }));

        })
}


http.createServer((req, res) => {

    // Obter toda a querie string da url
    const { name, url, del } = URL.parse(req.url, true).query;

    // Liberando o acesso a esta api para qualquer endereço que 'requisitar' os dados.
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    })

    // Se não tiver nenhuma querystring, é porque estamos na página inicial.
    if (!name || !url)
        return res.end(JSON.stringify(data));

    // Se a querystring 'del' for informada, vamos criar uma requisição para excluir o valor do JSON (urls.json
    if (del) {

        // Utilizando o 'filter' para manter somente as 'urls' que retornarem 'true'.
        data.urls = data.urls.filter(item => String(item.url) !== String(url));
        return writeFile(message => res.end(message));

    }

    // Criando um novo registor no JSON File (urls.json)
    data.urls.push({ name, url });
    return writeFile(message => res.end(message));

}).listen(3000, () => console.log('Api is running...'));