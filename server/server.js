const config = require("./config.js");
const http = require("node:http");

const server = http.createServer();

let returnObject = {};

// Listen for GET requests asking for info of a given steamId
server.on("request", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = new URL(req.url, `http://${config.host}:${config.port}`);
    let urlParamSteamId = url.searchParams.get("steamid");

    if (urlParamSteamId != null) {
        try {
            await getOwnedGames(urlParamSteamId);
            await getUserInfo(urlParamSteamId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            console.debug(returnObject);
            res.end(JSON.stringify(returnObject));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Bad Request: Missing steamid parameter" }));
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
                try {
                    let allPlaytime = getAllPlaytimeMins(JSON.parse(body.toString()).response.games);
                    returnObject.playtime = allPlaytime;
                    resolve();
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            });

            res.on("error", function (error) {
                console.error(error);
                reject(error)
            });
        });
        req.end();
    });
}


// Returns the sum of the time played in user's all games by minutes
function getAllPlaytimeMins(games) {
    let minutesPlayed = 0;
    for (let g = 0; g < games.length; g++) {
        minutesPlayed += games[g].playtime_forever;
    }

    return minutesPlayed;
}


// Get user's persona, avatar and profile url
function getUserInfo(steamId) {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'GET',
            'hostname': 'api.steampowered.com',
            'path': `/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_API_KEY}&steamids=${steamId}`,
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
                let userInfo = JSON.parse(body.toString());
                returnObject.personaName = userInfo.response.players[0].personaname;
                returnObject.avatar = userInfo.response.players[0].avatarfull;
                returnObject.profileUrl = userInfo.response.players[0].profileurl;

                resolve();
            });

            res.on("error", function (error) {
                console.error(error);
                reject(error);
            });
        });

        req.end();
    });
}