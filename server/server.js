const config = require("./config.js");
const http = require("node:http");


const server = http.createServer();

let returnText = "";
// Listen for GET requests asking for info of a given steamId
server.on("request", async (req, res) => {
    
    const url = new URL(req.url, `http://${config.host}:${config.port}`);
    let urlParamSteamId = url.searchParams.get("steamid");
    
    if (urlParamSteamId != null) {
        await getOwnedGames(urlParamSteamId);
        res.writeHead(200);
        res.end(returnText);
        returnText = "";
    }

})

server.listen(config.port, config.host, () => {
    console.log(`Server running on ${config.host}:${config.port}`)
});


// Get given steamId's owned game info from Steam Web API
function getOwnedGames(steamId) {
    return new Promise((resolve, reject) => {
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
                let allPlaytime = getAllPlaytimeMins(JSON.parse(body.toString()).response.games);
                console.debug(allPlaytime);
                returnText += allPlaytime;
                resolve();
            });
    
            res.on("error", function (error) {
                console.error(error);
                reject(error)
            });
        });
    
        req.end();

    })

}


function getAllPlaytimeMins(games) {
    let minutesPlayed = 0;
    for (let g = 0; g < games.length; g++) {
        minutesPlayed += games[g].playtime_forever;
    }

    return minutesPlayed;
}