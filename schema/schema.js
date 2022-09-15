const graphql = require('graphql');
const queryController = require ('../controllers/queryController');
const mutationController = require('../controllers/mutationController');

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} = graphql;

const WordInfoType = new GraphQLObjectType({
    name: 'WordInfo',
    fields: () => ({
        word: { type: new GraphQLList(GraphQLString) }, 
        mult: { type: new GraphQLList(GraphQLInt) }, 
        points: { type: GraphQLInt }, 
        bingo: { type: GraphQLBoolean }
    })
});

const OtherPlayerTilesType = new GraphQLObjectType({
    name: 'OtherPlayerTiles',
    fields: () => ({
        tiles: { type: new GraphQLList(GraphQLString) }, 
        score: { type: GraphQLInt }
    })
});

const GameInfoType = new GraphQLObjectType({
    name: 'GameInfo',
    fields: () => ({
        name: { type: GraphQLString },
        score: { type: GraphQLInt },
        words: { type: new GraphQLList(WordInfoType) },
        lostPoints: { type: GraphQLInt },
        lastLetters: { type: new GraphQLList(GraphQLString) },
        otherPlayerTiles: { type: OtherPlayerTilesType }
    })
});

const ScrabbleGameInfoType = new GraphQLObjectType({
    name: 'ScrabbleGameInfo',
    fields: () => ({
        id: { type: GraphQLID },
        players: { type: new GraphQLList(GraphQLString) },
        gameInfo: { type: new GraphQLList(GameInfoType) },
        date: { type: GraphQLString }
    })
});

const PlayerGameHighScoresType = new GraphQLObjectType({
    name: 'PlayerGameHighscore',
    fields: () => ({
        scrabbleGameId: { type: GraphQLID },
        score: { type: GraphQLInt },
        date: { type: GraphQLString }
    })
});

const PlayerHighscoresType = new GraphQLObjectType({
    name: 'PlayerHighscores',
    fields: () => ({
        twoPlayer: { type: new GraphQLList(PlayerGameHighScoresType) },
        threePlayer: { type: new GraphQLList(PlayerGameHighScoresType) },
        fourPlayer: { type: new GraphQLList(PlayerGameHighScoresType) }
    })
});

const PlayerSingleGameInfoType = new GraphQLObjectType({
    name: 'PlayerSingleGameInfo',
    fields: () => ({
        gamesPlayed: { type: GraphQLInt },
        gamesWon: { type: GraphQLInt },
        averageScore: { type: GraphQLFloat }
    })
});

const PlayerTotalGamesInfoType = new GraphQLObjectType({
    name: 'PlayerTotalGamesInfo',
    fields: () => ({
        twoPlayer: { type: PlayerSingleGameInfoType },
        threePlayer: { type: PlayerSingleGameInfoType },
        fourPlayer: { type: PlayerSingleGameInfoType },
        total: { type: PlayerSingleGameInfoType }
    })
});

const PlayerStatsType = new GraphQLObjectType({
    name: 'PlayerStats',
    fields: () => ({
        name: { type: GraphQLString },
        gamesInfo: { type: PlayerTotalGamesInfoType },
        gameHighscores: { type: PlayerHighscoresType },
        wordHighscores: { type: new GraphQLList(WordInfoType) }
    })
});

const GroupedPlayerStatsType = new GraphQLObjectType({
    name: 'GroupedPlayerStats',
    fields: () => ({
        scrabbleGameId: { type: GraphQLID },
        date: { type: GraphQLString },
        scores: { type: new GraphQLList(GraphQLInt) }
    })
});

const ScrabbleGamesWithPlayersType = new GraphQLObjectType({
    name: 'ScrabbleGamesWithPlayers',
    fields: () => ({
        players: { type: new GraphQLList(GraphQLString) },
        gamesTogether: { type: new GraphQLList(GroupedPlayerStatsType) }
    })
});

const AlltimeSingleGameHSType = new GraphQLObjectType({
    name: 'AlltimeSingleGameHS',
    fields: () => ({
        player: { type: GraphQLString },
        score: { type: GraphQLInt },
        date: { type: GraphQLString },
        scrabbleGameId: { type: GraphQLID }   
    })
});

const AlltimeGameHSType = new GraphQLObjectType({
    name: 'AlltimeGameHS',
    fields: () => ({
        twoPlayer: { type: new GraphQLList(AlltimeSingleGameHSType) },
        threePlayer: { type: new GraphQLList(AlltimeSingleGameHSType) },
        fourPlayer: { type: new GraphQLList(AlltimeSingleGameHSType) },
    })
});

const AlltimeWordHSType = new GraphQLObjectType({
    name: 'AlltimeWordHS',
    fields: () => ({
        player: { type: GraphQLString },
        word: { type: WordInfoType },
        scrabbleGameId: { type: GraphQLID }
    })
});

const AlltimeStatsType = new GraphQLObjectType({
    name: 'AlltimeStats',
    fields: () => ({
        gameHS: { type: AlltimeGameHSType },
        wordHS: { type: new GraphQLList(AlltimeWordHSType) }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getScrabbleGamesByPlayers: {
            type: new GraphQLList(ScrabbleGameInfoType),
            args: { players: { type: new GraphQLList(GraphQLString) } },
            resolve(parent, args) {
                return queryController.getScrabbleGamesByPlayers(args);
            }
        },
        getScrabbleGamesWithPlayers: {
            type: ScrabbleGamesWithPlayersType,
            args: { players: { type: new GraphQLList(GraphQLString) },
                    numGames: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return queryController.getScrabbleGamesWithPlayers(args);
            }
        },
        getScrabbleGameById: {
            type: ScrabbleGameInfoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return queryController.getScrabbleGameById(args);
            }
        },
        getScrabbleGamesOfAPlayer: {
            type: new GraphQLList(ScrabbleGameInfoType),
            args: { player: { type: GraphQLString } },
            resolve(parent, args) {
                return queryController.getScrabbleGamesOfAPlayer(args);
            }
        },
        getPlayerStats: {
            type: PlayerStatsType,
            args: { player: { type: GraphQLString },
                    numGameHS: { type: GraphQLInt },
                    numWordHS: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return queryController.getPlayerStats(args);
            }
        },
        getAlltimeStats: {
            type: AlltimeStatsType,
            args: { 
                numGameHS: { type: GraphQLInt },
                numWordHS: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return queryController.getAlltimeStats(args);
            }
        }
    }
 });

//  MUTATIONS
const WordInfoInputType = new GraphQLInputObjectType({
    name: 'WordInfoInput',
    fields: () => ({
        word: { type: new GraphQLList(GraphQLString) },
        mult: { type: new GraphQLList(GraphQLInt) },
        points: { type: GraphQLInt },
        bingo: { type: GraphQLBoolean }
    })
});

const OtherPlayerTilesInputType = new GraphQLInputObjectType({
    name: 'OtherPlayerTilesInput',
    fields: () => ({
        tiles: {type: new GraphQLList(GraphQLString) }, 
        score: { type: GraphQLInt }
    })
});

const GameInfoInputType = new GraphQLInputObjectType({
    name: 'GameInfoInput',
    fields: () => ({
        name: { type: GraphQLString },
        score: { type: GraphQLInt },
        words: { type: new GraphQLList(WordInfoInputType) },
        lostPoints: { type: GraphQLInt },
        lastLetters: { type: new GraphQLList(GraphQLString) },
        otherPlayerTiles: { type: OtherPlayerTilesInputType }
    })
});

 const Mutations  = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        addScrabbleGame: {
            type: ScrabbleGameInfoType,
            args: {
                players: { type: new GraphQLList(GraphQLString) },
                gameInfo: { type: new GraphQLList(GameInfoInputType) }
            },
            resolve(parent, args) {
                return mutationController.addScrabbleGame(args);
            }
        }
    }
 });
 
module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutations 
});