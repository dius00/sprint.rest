const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const app = express();
  app.use(express.json());

  ///////////////////////////////////////////////////
  ////////POKEMON POKEMON/////////////////////////
  //////////////////////////////////////////

  app.get("/api/pokemon", (req, res) => {
    if (req.query.n) res.send(pokeData.pokemon.slice(0, req.query.n));
    else res.send(pokeData.pokemon);
  });

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

  app.get("/api/pokemon/:value/evolutions/previous", (req, res) => {
    const { value } = req.params;
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase())
          res.send(poke["Previous evolution(s)"].slice(-1));
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId)
          res.send(poke["Previous evolution(s)"].slice(-1));
      });
    }
  });

  ///////////////////////////////////////////////////
  ////////TYPES TYPES/////////////////////////
  //////////////////////////////////////

  app.get("/api/types", (req, res) => {
    if (req.query.n) res.send(pokeData.types.slice(0, req.query.n));
    else res.send(pokeData.types);
  });

  app.get("/api/types/:type/pokemon", (req, res) => {
    const result = [];
    pokeData.pokemon.forEach((poke) => {
      if (poke.types.includes(req.params.type)) {
        result.push({ id: poke.id, name: poke.name });
      }
    });
    res.send(result);
  });

  /////////////////////////////////////////////////////
  ////////ATTACKS ATTACKS/////////////////////////
  //////////////////////////////////////

  app.get("/api/attacks", (req, res) => {
    if (req.query.n) {
      const allatk = pokeData.attacks.fast.concat(pokeData.attacks.special);
      res.send(allatk.slice(0, req.query.n));
    } else res.send(pokeData.attacks);
  });

  app.get("/api/attacks/fast", (req, res) => {
    if (req.query.n) {
      res.send(pokeData.attacks.fast.slice(0, req.query.n));
    } else {
      res.send(pokeData.attacks.fast);
    }
  });

  app.get("/api/attacks/special", (req, res) => {
    if (req.query.n) {
      res.send(pokeData.attacks.special.slice(0, req.query.n));
    } else {
      res.send(pokeData.attacks.special);
    }
  });

  app.get("/api/attacks/:atkname", (req, res) => {
    const { atkname } = req.params;
    pokeData.attacks.fast.forEach((atk) => {
      if (atk.name === atkname) res.send(atk);
    });
    pokeData.attacks.special.forEach((atk) => {
      if (atk.name === atkname) res.send(atk);
    });
  });

  app.get("/api/attacks/:atkname/pokemon", (req, res) => {
    const { atkname } = req.params;
    const result = [];
    const all = pokeData.pokemon;
    for (const poke of all) {
      for (const fast of poke.attacks.fast) {
        if (fast.name === atkname) {
          result.push({
            id: poke.id,
            name: poke.name,
          });
        }
      }
      for (const special of poke.attacks.special) {
        if (special.name === atkname) {
          result.push({
            id: poke.id,
            name: poke.name,
          });
        }
      }
    }
    res.send(result);
  });

  return app;
};

module.exports = { setupServer };
