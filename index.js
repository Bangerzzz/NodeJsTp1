const http = require("http");
const fs = require('fs');
const path = require('path');
const host = 'localhost';
const port = 5000;
const contentType = {
    "js": { 'content-type': 'text/javascript' },
    "css": { 'content-type': 'text/css' },
    "png": { 'content-type': 'image/gif' },
}
const requestListener = function (req, res) {
    try{
        if (req.method=="GET" && req.url=="/"){
            res.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
            res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "index.html")));
            res.end();
        }
        else if (req.method!="GET" && req.url=="/"){
            res.writeHead(405,{"Content-Type": "text/html; charset=utf-8"})
            res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "not_allowed.html")));
            res.end();
        }
        else if (req.url.match(/\/public\/*.*/)) {
            const split = req.url.split('/')
            const file = split[split.length - 1].split('.')
            if (req.method === "GET") {
                res.writeHead(200, contentType[file[1]]);
                res.write(fs.readFileSync(path.join(__dirname, "public", file[1], `${file[0]}.${file[1]}`)));
                res.end();
            }
            else {
                res.writeHead(405, { 'content-type': 'text/html' });
                res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "method_not_allowed.html")));
                res.end();
            }
        }
        else if (req.url === "/api/names") {
            if (req.method === "GET") {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.write(JSON.stringify(mapToObj(memoryDb)));
                res.end();
            } 
            else if (req.method === "POST") {
                let data = ''
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    try {
                        if (typeof data === undefined) {
                            throw 'bad request'
                        } else {
                            data = JSON.parse(data)
                            if (!('name' in data)) {
                                throw 'bad request - test'
                            }
                            let currentId = id
                            memoryDb.set(id++, data)
                            res.writeHead(201, { 'content-type': 'application/json' });
                            res.write(JSON.stringify(memoryDb.get(currentId)));
                            res.end();
                        }
                    } catch (err) {
                        console.log(err)
                        res.writeHead(400, { 'content-type': 'text/html' });
                        res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "bad_request.html")));
                        res.end()
                    }
                });
            } 
            else {
                res.writeHead(405, { 'content-type': 'text/html' });
                res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "method_not_allowed.html")));
                res.end();
            }
        }
        else if (req.url.match(/\/api\/name\/*/)) {
            const split = req.url.split('/')
            const id = split[split.length-1]
            if (req.method === "GET") {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.write(JSON.stringify(memoryDb.get(parseInt(id))));
                res.end();
            } 
            else if (req.method === "DELETE") {
                memoryDb.delete(parseInt(id))
                res.writeHead(204);
                res.end();
            }
            else if (req.method === "PUT") {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                });
                req.on('end', () => {
                    try {
                        if (typeof data === undefined) {
                            throw 'bad request'
                        } else {
                            data = JSON.parse(data)
                            if (!('name' in data)) {
                                throw 'bad request - test'
                            }
                            memoryDb.set(id, data)
                            res.writeHead(204);
                            res.end();
                        }
                    } catch (err) {
                        console.log(err)
                        res.writeHead(400, { 'content-type': 'text/html' });
                        res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "bad_request.html")));
                        res.end()
                    }
                });
            }
            else {
                res.writeHead(405, { 'content-type': 'text/html' });
                res.write(fs.readFileSync(path.join(__dirname, "public", "pages", "method_not_allowed.html")));
                res.end();
            }
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

const memoryDb = new Map(); // est global
let id = 0; // doit être global
memoryDb.set(id++, {nom: "Alice"}) // voici comment set une nouvelle entrée.
memoryDb.set(id++, {nom: "Bob"})
memoryDb.set(id++, {nom: "Charlie"})

const mapToObj = m => {
    return Array.from(m).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});