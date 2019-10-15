'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const slugify = require('slugify')
const sequelizeTransforms = require('sequelize-transforms');
let db = {};

const sequelize = new Sequelize(
    global.config.db.database,
    global.config.db.user,
    global.config.db.pass,
    global.config.db.options)

sequelizeTransforms(sequelize, {
    slugify: (val, def) => {
        return def.slugify ? slugify(val, { lower: true }) : val
    }
});



sequelize.authenticate()
    .then(function (err) {
        console.log(`Connected to ${global.config.db.database} -database.`);
    })
    .catch(function (err) {
        console.log(red('Unable to connect to the database:', err));
    });

fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(file => file.name.endsWith('.model.js'))
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file.name));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
const initDB = require('../module/createDatabase')

db.sequelize = sequelize;
db.Sequelize = Sequelize;
const force = process.argv.includes("reset") || false
db.sequelize.sync({ force: force, logging: false }).then(() => force ? initDB() : '')





module.exports = db;