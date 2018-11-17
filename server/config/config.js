/*
Puerto aplicacion web
*/

process.env.PORT = process.env.PORT || 3000;


/** Entorno**/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/** Vencimiento Token**/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/** Seed de autenticacion**/
process.env.SEED = process.env.SEED || 'seed-desarrollo'

/****Base de datos**** */
let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_DB_URL;

process.env.URLDB = urlDB;