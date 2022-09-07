const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scrabbleGameInfoSchema = new Schema({
    players: [String],
    gameInfo: [{
        name: String,
        score: Number,
        words: [{
            word: [String],
            mult: [Number],
            points: Number,
            bingo: Boolean
        }],
        lostPoints: Number,
        lastLetters: [String],
        finalScore: [String],
        otherPlayerTiles: {
            tiles: [String],
            score: Number
        }
    }],
    date: String
});

module.exports = mongoose.model('ScrabbleGameInfo', scrabbleGameInfoSchema);