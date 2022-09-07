const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerHighscoreScheme = new Schema({
    name: String,
    highscore: Number,
    scrabbleGameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScrabbleGameInfo'
    }
});

module.exports = mongoose.model('PlayerHighscore', playerHighscoreScheme);