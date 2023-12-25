const ApiService = require('../services/apiService.js');
const DataBaseService = require('../services/dataBaseService.js');

class PokemonController {
    constructor() {
        this.apiService = new ApiService();
        this.dbService = new DataBaseService();
    }

    loadTypesInTable = async (req, res) => {
        try {
            const allTypes = await this.apiService.getTypesFromApi();
            const types = await this.dbService.insertTypesInDB(allTypes);
            return types;
        } catch (error) {
            throw error;
        }
    }

    getAllTypes = async (req, res) => {
        try {
            const allTypes = await this.dbService.getAllTypes();
            return res.status(200).json(allTypes);
        } catch (error) {
            console.log("Types", error);
            return res.status(404).send("Error al obtener los tipos.");
        }
    }

    updatePokemon = async (req, res) => {
        try {
            await this.dbService.updatePokemon(req);
            await this.dbService.updateTypes(req);

            return res.status(200).send("Pokemon actualizado");
        } catch (error) {
            return res.status(404).send("Error al actualizar el pokemon");
        }
    }

    getAllPokemons = async (req, res) => {
        try {
            const pokemonsApi = await this.apiService.getAllPokemons(15);
            const pokemonDB = await this.dbService.getAllPokemons();

            return res.json([...pokemonsApi, ...pokemonDB]);
        } catch (error) {
            console.log(error);
            return res.status(404).send('Internal Server Error');
        }
    }

    getPokemonById = async (req, res) => {
        try {
            const { id } = req.params;
            const source = isNaN(id) ? 'bdd' : 'api';

            if (source === 'api') {
                const pokeInfo = await this.apiService.getPokemonById(id);
                res.status(200).json(pokeInfo);
            } else if (source === 'bdd') {
                const pokeInfo = await this.dbService.getPokemonById(id);
                res.status(200).json(pokeInfo);
            }

        } catch (error) {
            res.status(404).send("¡Pokemon no encontrado!");
        }
    }

    removePokemonById = async (req, res) => {
        try {
            const { id } = req.params;
            const pokemonToDelete = await this.dbService.getPokemonById(id);

            if (!pokemonToDelete) {
                return res.status(404).send('Pokemon no encontrado.');
            }

            const deletionResult = await this.dbService.deletePokemonById(id);

            if (deletionResult) {
                return res.status(200).send('Pokemon elimindado con exito.');
            }
        } catch (error) {
            return res.status(500).send('Error al eliminar pokemon.');
        }
    }


    getPokemonByName = async (req, res) => {
        try {
            const { name } = req.query;

            if (!name) {
                res.status(400).send('Falta el nombre del pokemon.');
            }

            let pokeInfo = await this.apiService.getPokemonByName(name);

            if (!pokeInfo) {
                pokeInfo = await this.dbService.getPokemonByName(name);
            }

            res.status(200).json(pokeInfo);

        } catch (error) {
            console.log(error);
            res.status(404).send("¡Pokemon no encontrado!");
        }
    }

    postPokemon = async (req, res) => {
        try {
            const newPokemon = await this.dbService.postPokemon(req);
            await this.dbService.postType(req, newPokemon);
            return res.status(200).send("Pokemon creado con exito.");

        } catch (error) {
            return res.status(500).send("Error al crear pokemon.");
        }
    }
}

module.exports = PokemonController;