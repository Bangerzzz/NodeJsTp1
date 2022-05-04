const http = require("http");
const host = 'localhost';
const port = 5000;
const requestListener = function (req, res) {
    if (req.method=="GET"){
        res.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
        res.end(`<html><body><h1>HELLO WORLD Omar !</h1></body></html>`);
    }
    else{
        res.writeHead(404,{"Content-Type": "text/html; charset=utf-8"})
        res.end(`<h1>404 Méthode non authorisée</h1>`);
    }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});