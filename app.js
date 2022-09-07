require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');

const schema = require('./schema/schema')
 
const app = express();
 
app.use(cors({
    origin: process.env.ORIGIN_SERVER || '*'
}));

app.use('/graphql', graphqlHTTP({
   schema,
   graphiql: true
}));
 
app.listen(4000, () => {
   console.log('Listening on port 4000');
});

const mongoose = require('mongoose');
 
mongoose.connect(process.env.MONGO_CLOUD || "mongodb://localhost:27017");

mongoose.connection.once('open', () => {
   console.log('connected to database');
});
