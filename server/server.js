const config = require("./config.js");
const http = require("node:http");


const server = http.createServer();

// Listen for GET requests asking for info of a given steamId
server.on("request", (req, res) => {
    res.writeHead(200);
    res.end("Request sent.");

    const url = new URL(req.url, `http://${config.host}:${config.port}`);
    let urlParamSteamId = url.searchParams.get("steamid");

    getUserInfo(urlParamSteamId);
})

server.listen(config.port, config.host, () => {
    console.log(`Server running on ${config.host}:${config.port}`)
});


// Get given steamId's owned game info from Steam Web API
function getUserInfo(steamId) {
    var options = {
        'method': 'GET',
        'hostname': 'api.steampowered.com',
        'path': `/IPlayerService/GetOwnedGames/v0001/?key=${config.STEAM_API_KEY}&steamid=${steamId}&format=json`,
        'headers': {
        },
        'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    req.end();
}