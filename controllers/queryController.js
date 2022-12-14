const ScrabbleGameInfo = require('../models/ScrabbleGameInfo');
const { mean, std } = require('mathjs');

exports.getScrabbleGamesByPlayers = function getScrabbleGamesByPlayers(args) {
    return ScrabbleGameInfo.find({ players: args.players }).sort({date: -1});
}

exports.getScrabbleGameById = function getScrabbleGameById(args) {
    return ScrabbleGameInfo.findById(args.id);
}

exports.getScrabbleGamesOfAPlayer = function getScrabbleGamesOfAPlayer(args) {
    return ScrabbleGameInfo.find({ players: args.player }).sort({date: -1});
}

exports.getPlayerStats = function getPlayerStats(args) {
    return new Promise((resolve, reject) => {
        try {
            ScrabbleGameInfo.find({ players: args.player }, function (err, games) {
                if (err) return reject(err);
                if (!games) return reject(new Error('No stats found'));

                let twoPlayerGamesList = [];
                let threePlayerGamesList = [];
                let fourPlayerGamesList = [];

                let allPlayerWords = [];

                let gameInfoTracker = {
                    twoPlayer: {
                        totalPoints: [],
                        wins: 0,
                        played: 0
                    },
                    threePlayer: {
                        totalPoints: [],
                        wins: 0,
                        played: 0
                    },
                    fourPlayer: {
                        totalPoints: [],
                        wins: 0,
                        played: 0
                    }
                }

                games.forEach(function(game) {
                    let currentGame = { 
                        scrabbleGameId: game.id, 
                        score: game.gameInfo.find(e => e.name == args.player).score,
                        date: game.date
                    };

                    allPlayerWords = allPlayerWords.concat(game.gameInfo.find(e => e.name == args.player).words);

                    let gameScores = [];
                    for (let g of game.gameInfo) {
                        gameScores.push({ name: g.name, score: g.score });
                    }
                    gameScores.sort(function(a,b) { return b.score - a.score });

                    switch (game.players.length) {
                        case 2:
                            twoPlayerGamesList.push(currentGame);

                            gameInfoTracker.twoPlayer.played+=1;
                            gameInfoTracker.twoPlayer.totalPoints.push(game.gameInfo.find(e => e.name == args.player).score);
                            if (gameScores[0].name == args.player) gameInfoTracker.twoPlayer.wins+=1;
                            break;
                        case 3:
                            threePlayerGamesList.push(currentGame);

                            gameInfoTracker.threePlayer.played+=1;
                            gameInfoTracker.threePlayer.totalPoints.push(game.gameInfo.find(e => e.name == args.player).score);
                            if (gameScores[0].name == args.player) gameInfoTracker.threePlayer.wins+=1;
                            break;
                        case 4:
                            fourPlayerGamesList.push(currentGame);

                            gameInfoTracker.fourPlayer.played+=1;
                            gameInfoTracker.fourPlayer.totalPoints.push(game.gameInfo.find(e => e.name == args.player).score);
                            if (gameScores[0].name == args.player) gameInfoTracker.fourPlayer.wins+=1;
                            break;
                        default:
                    }
                 });

                twoPlayerGamesList.sort(function(a,b) { return b.score - a.score });
                threePlayerGamesList.sort(function(a,b) { return b.score - a.score });
                fourPlayerGamesList.sort(function(a,b) { return b.score - a.score });

                allPlayerWords.sort(function(a,b) { return b.points - a.points });

                let numHighscoreGames = args.numGameHS;
                let numHighscoreWords = args.numWordHS;

                let totalGamesPlayed = gameInfoTracker.twoPlayer.played + gameInfoTracker.threePlayer.played + gameInfoTracker.fourPlayer.played;
                let totalWins = gameInfoTracker.twoPlayer.wins + gameInfoTracker.threePlayer.wins + gameInfoTracker.fourPlayer.wins;

                let playerStats = {
                    name: args.player,
                    gamesInfo: { 
                        twoPlayer: {
                            gamesPlayed: gameInfoTracker.twoPlayer.played, 
                            gamesWon: gameInfoTracker.twoPlayer.wins, 
                            averageScore: mean(gameInfoTracker.twoPlayer.totalPoints).toFixed(1),
                            sd: std(gameInfoTracker.twoPlayer.totalPoints).toFixed(1)
                        }, 
                        threePlayer: {
                            gamesPlayed: gameInfoTracker.threePlayer.played, 
                            gamesWon: gameInfoTracker.threePlayer.wins, 
                            averageScore: mean(gameInfoTracker.threePlayer.totalPoints).toFixed(1),
                            sd: std(gameInfoTracker.threePlayer.totalPoints).toFixed(1)
                        }, 
                        fourPlayer: {
                            gamesPlayed: gameInfoTracker.fourPlayer.played, 
                            gamesWon: gameInfoTracker.fourPlayer.wins, 
                            averageScore: mean(gameInfoTracker.fourPlayer.totalPoints).toFixed(1),
                            sd: std(gameInfoTracker.fourPlayer.totalPoints).toFixed(1)
                        }, 
                        total: {
                            gamesPlayed: totalGamesPlayed, 
                            gamesWon: totalWins, 
                            averageScore: 0,
                            sd: 0
                        },
                    },
                    gameHighscores: {
                        twoPlayer: twoPlayerGamesList.length < numHighscoreGames ? twoPlayerGamesList : twoPlayerGamesList.slice(0, numHighscoreGames),
                        threePlayer: threePlayerGamesList.length < numHighscoreGames ? threePlayerGamesList : threePlayerGamesList.slice(0, numHighscoreGames),
                        fourPlayer: fourPlayerGamesList.length < numHighscoreGames ? fourPlayerGamesList : fourPlayerGamesList.slice(0, numHighscoreGames)
                    },
                    wordHighscores: allPlayerWords.length < numHighscoreWords ? allPlayerWords : allPlayerWords.slice(0, numHighscoreWords)
                };

                return resolve(playerStats);
            });
        } catch (err) {
            return reject(err);
        }
    });
}

exports.getScrabbleGamesWithPlayers = function getScrabbleGamesWithPlayers(args) {
    return new Promise((resolve, reject) => {
        try {
            ScrabbleGameInfo.find({ players: { $all: args.players }}, function (err, games) {
                if (err) return reject(err);
                if (!games) return reject(new Error('No stats found'));

                let names = args.players.sort();

                let gamesTogether = [];

                let i = 0;
                games.forEach(function(game) {
                    if (i < args.numGames && game.players.length === args.gameType) {
                        let currentScores = [];

                        for (let p of names) {
                            currentScores.push(game.gameInfo.find(e => e.name == p).score);
                        }

                        gamesTogether.push({
                            scrabbleGameId: game.id,
                            date: game.date,
                            scores: currentScores
                        });

                        i++;
                    }
                });

                let gamesFound = {
                    players: names,
                    gamesTogether: gamesTogether
                }

                return resolve(gamesFound);
            }).sort({date: -1});
        } catch (err) {
            return reject(err);
        }
    });
}

exports.getAlltimeStats = function getAlltimeStats(args) {
    return new Promise((resolve, reject) => {
        try {
            ScrabbleGameInfo.find({}, function (err, games) {
                if (err) return reject(err);
                if (!games) return reject(new Error('No stats found'));

                let twoPlayerGameHS = [];
                let threePlayerGameHS = [];
                let fourPlayerGameHS = [];

                let wordHS = [];

                games.forEach(function(game) {
                    let temp = [];
                    for (let info of game.gameInfo) {
                        temp.push({player: info.name, score: info.score, date: game.date, scrabbleGameId: game.id});

                        for (let word of info.words) {
                            wordHS.push({ player: info.name, word: word, scrabbleGameId: game.id, score: word.points});
                        }
                    }

                    switch (game.players.length) {
                        case 2:
                            twoPlayerGameHS = twoPlayerGameHS.concat(temp);
                            break;
                        case 3:
                            threePlayerGameHS = threePlayerGameHS.concat(temp);
                            break;
                        case 4:
                            fourPlayerGameHS = fourPlayerGameHS.concat(temp);
                            break;
                        default:
                    }
                      
                });

                twoPlayerGameHS.sort(function(a,b) { return b.score - a.score });
                threePlayerGameHS.sort(function(a,b) { return b.score - a.score });
                fourPlayerGameHS.sort(function(a,b) { return b.score - a.score });

                wordHS.sort(function(a,b) { return b.score - a.score });

                let finalAlltimeStats = {
                    gameHS: {
                        twoPlayer: twoPlayerGameHS.length < args.numGameHS ? twoPlayerGameHS : twoPlayerGameHS.slice(0, args.numGameHS),
                        threePlayer: threePlayerGameHS.length < args.numGameHS ? threePlayerGameHS : threePlayerGameHS.slice(0, args.numGameHS),
                        fourPlayer: fourPlayerGameHS.length < args.numGameHS ? fourPlayerGameHS : fourPlayerGameHS.slice(0, args.numGameHS),
                    },
                    wordHS: wordHS.length < args.numWordHS ? wordHS : wordHS.slice(0, args.numWordHS)
                }

                return resolve(finalAlltimeStats);
            })
        } catch (err) {
            return reject(err);
        }
    });
}

exports.getScrabbleHistoryOfPlayers = function getScrabbleHistoryOfPlayers(args) {
    let skipNum = (args.pageNum - 1) * args.pageSize;
    let limitNum = args.pageSize;

    return ScrabbleGameInfo.find({ players: { $all: args.players }}).sort({date: -1}).skip(skipNum).limit(limitNum);
}