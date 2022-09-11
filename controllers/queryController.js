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

exports.getPlayerStats = function getPlayerStats(args) {
    return new Promise((resolve, reject) => {
        try {
            ScrabbleGameInfo.find({ players: args.player }, function (err, games) {
                if (err) return reject(err);
                if (!games) return reject(new Error('No words found'));

                let playerGamesList = [];
                let allPlayerWords = [];

                let gameInfoTracker = {
                    twoPlayer: {
                        totalPoints: 0,
                        wins: 0,
                        played: 0
                    },
                    threePlayer: {
                        totalPoints: 0,
                        wins: 0,
                        played: 0
                    },
                    fourPlayer: {
                        totalPoints: 0,
                        wins: 0,
                        played: 0
                    }
                }

                games.forEach(function(game) {
                    playerGamesList.push({ 
                        scrabbleGameId: game.id, 
                        score: game.gameInfo.find(e => e.name == args.player).score,
                        date: game.date
                    });

                    allPlayerWords = allPlayerWords.concat(game.gameInfo.find(e => e.name == args.player).words);

                    let gameScores = [];
                    for (let g of game.gameInfo) {
                        gameScores.push({ name: g.name, score: g.score });
                    }
                    gameScores.sort(function(a,b) { return b.score - a.score });

                    switch (game.players.length) {
                        case 2:
                            gameInfoTracker.twoPlayer.played+=1;
                            gameInfoTracker.twoPlayer.totalPoints+=game.gameInfo.find(e => e.name == args.player).score;
                            if (gameScores[0].name == args.player) gameInfoTracker.twoPlayer.wins+=1;
                            break;
                        case 3:
                            gameInfoTracker.threePlayer.played+=1;
                            gameInfoTracker.threePlayer.totalPoints+=game.gameInfo.find(e => e.name == args.player).score;
                            if (gameScores[0].name == args.player) gameInfoTracker.threePlayer.wins+=1;
                            break;
                        case 4:
                            gameInfoTracker.fourPlayer.played+=1;
                            gameInfoTracker.fourPlayer.totalPoints+=game.gameInfo.find(e => e.name == args.player).score;
                            if (gameScores[0].name == args.player) gameInfoTracker.fourPlayer.wins+=1;
                            break;
                        default:
                    }
                 });

                playerGamesList.sort(function(a,b) { return b.score - a.score });
                allPlayerWords.sort(function(a,b) { return b.points - a.points });
                numRecordsToReturn = 10;

                let totalGamesPlayed = gameInfoTracker.twoPlayer.played + gameInfoTracker.threePlayer.played + gameInfoTracker.fourPlayer.played;
                let totalWins = gameInfoTracker.twoPlayer.wins + gameInfoTracker.threePlayer.wins + gameInfoTracker.fourPlayer.wins;
                let totalScore = gameInfoTracker.twoPlayer.totalPoints + gameInfoTracker.threePlayer.totalPoints + gameInfoTracker.fourPlayer.totalPoints;

                let playerStats = {
                    name: args.player,
                    gamesInfo: { 
                        twoPlayer: {
                            gamesPlayed: gameInfoTracker.twoPlayer.played, 
                            gamesWon: gameInfoTracker.twoPlayer.wins, 
                            averageScore: gameInfoTracker.twoPlayer.played > 0 ? (parseFloat(gameInfoTracker.twoPlayer.totalPoints) / parseFloat(gameInfoTracker.twoPlayer.played)).toFixed(1) : 0
                        }, 
                        threePlayer: {
                            gamesPlayed: gameInfoTracker.threePlayer.played, 
                            gamesWon: gameInfoTracker.threePlayer.wins, 
                            averageScore: gameInfoTracker.threePlayer.played > 0 ? (parseFloat(gameInfoTracker.threePlayer.totalPoints) / parseFloat(gameInfoTracker.threePlayer.played)).toFixed(1) : 0
                        }, 
                        fourPlayer: {
                            gamesPlayed: gameInfoTracker.fourPlayer.played, 
                            gamesWon: gameInfoTracker.fourPlayer.wins, 
                            averageScore: gameInfoTracker.fourPlayer.played > 0 ? (parseFloat(gameInfoTracker.fourPlayer.totalPoints) / parseFloat(gameInfoTracker.fourPlayer.played)).toFixed(1) : 0
                        }, 
                        total: {
                            gamesPlayed: totalGamesPlayed, 
                            gamesWon: totalWins, 
                            averageScore: totalGamesPlayed > 0 ? (parseFloat(totalScore) / parseFloat(totalGamesPlayed)).toFixed(1) : 0
                        },
                    },
                    gameHighscores: playerGamesList.length < numRecordsToReturn ? playerGamesList : playerGamesList.slice(0, numRecordsToReturn),
                    wordHighscores: allPlayerWords.length < numRecordsToReturn ? allPlayerWords : allPlayerWords.slice(0, numRecordsToReturn)
                };

                return resolve(playerStats);
            });
        } catch (err) {
            return reject(err);
        }
    });
}