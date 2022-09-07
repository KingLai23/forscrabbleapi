const graphql = require('graphql');
const ScrabbleGameInfo = require('../models/ScrabbleGameInfo');
const PlayerHighscore = require('../models/PlayerHighscore');

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
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
        finalScore: { type: new GraphQLList(GraphQLString) },
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

const PlayerHighscoreType = new GraphQLObjectType({
    name: 'PlayerHighscore',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        highscore: { type: GraphQLInt },
        scrabbleGameId: { type: GraphQLID }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getScrabbleGamesByPlayers: {
            type: new GraphQLList(ScrabbleGameInfoType),
            args: { players: { type: new GraphQLList(GraphQLString) } },
            resolve(parent, args) {
                return ScrabbleGameInfo.find({ players: args.players }).sort({date: 1});
            }
        },
        getScrabbleGameById: {
            type: ScrabbleGameInfoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ScrabbleGameInfo.findById(args.id);
            }
        }
    }
 });

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
        finalScore: { type: new GraphQLList(GraphQLString) },
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
                let scrabbleGameInfo = new ScrabbleGameInfo({
                    players: args.players,
                    gameInfo: args.gameInfo,
                    date: new Date().toISOString()
                });
                return scrabbleGameInfo.save();
            }
        }
    }
 });
 
module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutations 
});