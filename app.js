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
 
let port = process.env.PORT || 4000;
app.listen(port, () => {
   console.log('Listening on port' + port);
});

const mongoose = require('mongoose');
 
mongoose.connect(process.env.MONGO_CLOUD || "mongodb://localhost:27017");

mongoose.connection.once('open', () => {
   console.log('connected to database');
});
