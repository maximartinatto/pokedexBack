const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const PokemonController = require('./src/controllers/pokemonController.js');
const pokemonController = new PokemonController();

conn.sync({ force: false }).then(() => {
    server.listen(3001, () => {
        pokemonController.loadTypesInTable();
        console.log('App listening at 3001');
    });
});