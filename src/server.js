const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/pokemon", (req, res) => {
    if (req.query.n) res.send(pokeData.pokemon.slice(0, 15));
    else res.send(pokeData.pokemon);
  });

  // app.use(["/api/pokemon/:value", "/api/pokemon/:value/evolutions"], (req, res, next) => {
  //   const { value } = req.params;
  //   if (isNaN(Number(value))) {
  //     pokeData.pokemon.forEach((poke) => {
  //       if (poke.name === value) req.pass = poke;
  //     });
  //   } else {
  //     const pokeId = Number(value);
  //     pokeData.pokemon.forEach((poke) => {
  //       if (Number(poke.id) === pokeId) req.pass = poke;
  //     });
  //   }
  //   next();
  // });

  app.get("/api/pokemon/:value", (req, res) => {
    const { value } = req.params;
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase()) res.send(poke);
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) res.send(poke);
      });
    }
  });

  app.get("/api/pokemon/:value/evolutions", (req, res) => {
    const { value } = req.params;
    console.log(value);
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase())
          res.send(poke.evolutions);
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) res.send(poke.evolutions);
      });
    }
  });

  return app;
};

module.exports = { setupServer };
