const MongoClient = require('mongodb').MongoClient;
const dbSettings = require('../appsettings.json').Database;
const dal = { db: null, client: null };
const dbString = process.env.MONGODB_URI || require('../appsettings.json').Database.ConnectString;
const defaultDB = dbString.substr(dbString.lastIndexOf('/') + 1);
MongoClient.connect(dbString, (err, client) => {
    if (err) {
        console.error("Failed to connect DB", err);
        throw (err);
        return;
    }
    dal.client = client;
    dal.db = client.db(defaultDB);
    if (!dal.db) {
        let err = dbName + ' DB not found';
        console.error(err);
        throw (err);
    }
    console.log("Connect DB successfully");
})
module.exports = dal;