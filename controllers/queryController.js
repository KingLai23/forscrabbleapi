const ScrabbleGameInfo = require('../models/ScrabbleGameInfo');

exports.getScrabbleGamesByPlayers = function getScrabbleGamesByPlayers(args) {
    return ScrabbleGameInfo.find({ players: args.players }).sort({date: -1});
}

exports.getScrabbleGameById = function getScrabbleGameById(args) {
    return ScrabbleGameInfo.findById(args.id);
}

exports.getScrabbleGamesOfAPlayer = function getScrabbleGamesOfAPlayer(args) {
    return ScrabbleGameInfo.find({ players: args.player }).sort({date: -1});
}

exports.getHighscoresOfAPlayer = function getHighscoresOfAPlayer(args) {
    return new Promise((resolve, reject) => {
        try {
            ScrabbleGameInfo.find({ players: args.player }, function (err, games) {
                if (err) return reject(err);
                if (!games) return reject(new Error('No games found'));

                let playerHighscoreList = [];
                games.forEach(function(game) {
                    playerHighscoreList.push({ 
                        scrabbleGameId: game.id, 
                        score: game.gameInfo.find(e => e.name == args.player).score
                    });
                });

                playerHighscoreList.sort(function(a,b) { return b.score - a.score });

                numRecordsToReturn = 10;

                return resolve(playerHighscoreList.length < numRecordsToReturn ? playerHighscoreList : playerHighscoreList.slice(0, numRecordsToReturn));
            });
        } catch (err) {
            return reject(err);
        }
    });
}

exports.getHighestWordScoresOfAPlayer = function getHighestWordScoresOfAPlayer(args) {
    return new Promise((resolve, reject) => {
        try {
            ScrabbleGameInfo.find({ players: args.player }, function (err, games) {
                if (err) return reject(err);
                if (!games) return reject(new Error('No words found'));

                let allPlayerWords = [];
                games.forEach(function(game) {
                    allPlayerWords = allPlayerWords.concat(game.gameInfo.find(e => e.name == args.player).words);
                 });

                allPlayerWords.sort(function(a,b) { return b.points - a.points });

                numRecordsToReturn = 10;

                return resolve(allPlayerWords.length < numRecordsToReturn ? allPlayerWords : allPlayerWords.slice(0, numRecordsToReturn));
            });
        } catch (err) {
            return reject(err);
        }
    });
}