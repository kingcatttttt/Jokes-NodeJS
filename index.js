import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import http from 'http'
import url from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let apiToken = "qwerty123456";

let server = http.createServer(function(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    if (request.method === "OPTIONS") {
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, PATCH", // REQUIRED CORS HEADER
            "Access-Control-Allow-Headers": "Origin, api-token, X-Requested-With, Content-Type, Accept" // REQUIRED CORS HEADER
        });
        response.end();
    }
    if (request.url === "/jokes" && request.method === "GET") {
        getAllJokes(request, response);
    } 
    if (request.url.startsWith("/jokes") && request.method === "GET"
                && request.url.length > 6) {
        getJoke(request, response);
    }
    if (request.url === "/jokes" && request.method === "POST") {
        addJoke(request, response);
    }
    if(request.url.startsWith("/like") && request.method === "GET") {
        likeDislike(request, response);
    }
    if(request.url.startsWith("/dislike") && request.method === "GET") {
        likeDislike(request, response);
    }
});
// npm i --save-dev nodemon
// npm i -g nodemon
server.listen(3000);
let dataPath = path.join(__dirname, "data");
function getAll() {
    let allJokes = [];
    let dirPath = fs.readdirSync(dataPath);
    for (let i = 0; i < dirPath.length; i++) {
        let filePath = path.join(dataPath, i + ".json")
        let file = fs.readFileSync(filePath, "utf-8");
        let joke = JSON.parse(file);
        joke.id = i;
        allJokes.push(joke);
    }
    return allJokes;
}

function getAllJokes(request, response) {
    response.writeHead(200, "Okey", {"Content-type": "application/json"});
    response.end(JSON.stringify(getAll()));
}

function getJoke(request, response) {
    let params = url.parse(request.url, true).query;
    let id = params.id;
    let joke = getAll().filter(function(j) {
        return j.id === id;
    });
    response.writeHead(200, "Okey", {"Content-type": "application/json"});
    response.end(JSON.stringify(joke));
}

function addJoke(request, response) {
    if (request.headers["api-token"] === apiToken) {
        let data = "";
        request.on("data", function(chunk) {
            data += chunk;
        })

        request.on("end", function() {
            let joke = JSON.parse(data);
            joke.likes = 0;
            joke.dislikes = 0;
            let dir = fs.readdirSync(dataPath);
            let filename = dir.length + ".json";
            let filepath = path.join(dataPath, filename);
            fs.writeFileSync(filepath, JSON.stringify(joke));
            response.writeHead(200, "Okey", {"Content-type": "application/json"});
            response.end(JSON.stringify(joke));
        })
    } else {
        response.writeHead(403, "Access denied");
        response.end(
            JSON.stringify({
                "error": "Api token is not valid"
            })
        );
    }
}

function likeDislike(request, response) {
    const params = url.parse(request.url, true);
    let jokeId = params.query.id;
    if (jokeId) {
        let filePath = path.join(dataPath, jokeId + ".json");
        let jokeText = fs.readFileSync(filePath, "utf-8");
        let joke = JSON.parse(jokeText);
        if (params.pathname === "/like") joke.likes++;
        if (params.pathname === "/dislike") joke.dislikes++;
        fs.writeFileSync(filePath, JSON.stringify(joke));
        response.writeHead(200, "Good");
        response.end();
    } else {
        response.writeHead(400, "Bad request");
        response.end();
    }
}
