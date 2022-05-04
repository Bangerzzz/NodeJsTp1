const http = require("http");
const fs = require('fs');
const path = require('path');
const host = 'localhost';
const port = 5000;
const requestListener = function (req, res) {
    try{
        if (req.method=="GET" && req.url=="/"){
            res.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
            res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "index.html")));
            res.end();
        }
        else if (req.method!="GET" && req.url=="/"){
            res.writeHead(401,{"Content-Type": "text/html; charset=utf-8"})
            res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "not_allowed.html")));
            res.end();
        }
        else {
            res.writeHead(404,{"Content-Type": "text/html; charset=utf-8"})
            res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "not_found.html")));
            res.end();
        }
    }catch(error){
        res.writeHead(500,{"Content-Type": "text/html; charset=utf-8"})
        res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "interal_serveur_error.html")));
        res.end();
    }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});