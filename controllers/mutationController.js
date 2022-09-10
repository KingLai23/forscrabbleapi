const ScrabbleGameInfo = require('../models/ScrabbleGameInfo');

exports.addScrabbleGame = function addScrabbleGame(args) {
    let scrabbleGameInfo = new ScrabbleGameInfo({
        players: args.players,
        gameInfo: args.gameInfo,
        date: new Date().toISOString()
    });

    return scrabbleGameInfo.save();
}
