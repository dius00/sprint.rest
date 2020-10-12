const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/pokemon", (req, res) => {
    //console.log(pokeData.pokemon);

    if (req.query.n) res.send(pokeData.pokemon.slice(0, 15));
    else res.send(pokeData.pokemon);
  });

  return app;
};

module.exports = { setupServer };
