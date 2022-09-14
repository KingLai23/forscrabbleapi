const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alltimeHighscoresSchema = new Schema({
    gameHighscores: {
        twoPlayer: [{
            name: String,
            score: Number,
            date: String,
            gameId: String
        }],
        threePlayer: [{
            name: String,
            score: Number,
            date: String,
            gameId: String
        }],
        fourPlayer: [{
            name: String,
            score: Number,
            date: String,
            gameId: String
        }]
    },
    wordHighscores: [{
        name: String,
        word: [String],
        mult: [Number],
        points: Number,
        bingo: boolean
    }]
});

module.exports = mongoose.model('AlltimeHighscores', alltimeHighscoresSchema);