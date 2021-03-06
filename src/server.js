const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const app = express();
  app.use(express.json());

  ///////////////////////////////////////////////////
  ////////POKEMON POKEMON/////////////////////////
  //////////////////////////////////////////

  app.post("/api/pokemon", (req, res) => {
    const { body } = req;
    pokeData.pokemon.push(body);
    res.sendStatus(200);
  });

  app.patch("/api/pokemon/:value", (req, res) => {
    const { body } = req;
    const { value } = req.params;
    let patched = false;
    function update(pokemon, updateObj) {
      for (const key of Object.keys(updateObj)) {
        pokemon[key] = updateObj[key];
      }
    }
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase()) {
          update(poke, body);
          patched = true;
        }
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) {
          update(poke, body);
          patched = true;
        }
      });
    }
    patched ? res.sendStatus(200) : res.sendStatus(400);
  });

  app.delete("/api/pokemon/:value", (req, res) => {
    const { value } = req.params;
    let removed = false;
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase()) {
          const spliceIndex = pokeData.pokemon.indexOf(poke);
          pokeData.pokemon.splice(spliceIndex, 1);
          removed = true;
        }
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) {
          const spliceIndex = pokeData.pokemon.indexOf(poke);
          pokeData.pokemon.splice(spliceIndex, 1);
          removed = true;
        }
      });
    }
    removed ? res.sendStatus(200) : res.sendStatus(400);
  });

  app.get("/api/pokemon", (req, res) => {
    if (req.query.n) {
      const limit = Number(req.query.n);
      if (limit < 1 || isNaN(limit)) {
        res.sendStatus(406);
      } else if (limit <= pokeData.pokemon.length) {
        res.send(pokeData.pokemon.slice(0, limit));
      }
    } else res.send(pokeData.pokemon);
  });

  app.get("/api/pokemon/:value", (req, res) => {
    const { value } = req.params;
    let found = false;
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase()) {
          res.send(poke);
          found = true;
        }
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) {
          res.send(poke);
          found = true;
        }
      });
    }
    if (!found) res.sendStatus(404);
  });

  app.get("/api/pokemon/:value/evolutions", (req, res) => {
    const { value } = req.params;
    let found = false;
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase()) {
          found = true;
          if (poke.evolutions) res.send(poke.evolutions);
          else res.send([]);
        }
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) {
          found = true;
          if (poke.evolutions) res.send(poke.evolutions);
          else res.send([]);
        }
      });
    }
    if (!found) res.sendStatus(404);
  });

  app.get("/api/pokemon/:value/evolutions/previous", (req, res) => {
    const { value } = req.params;
    let found = false;
    if (isNaN(Number(value))) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.name.toLowerCase() === value.toLowerCase()) {
          found = true;
          if (poke["Previous evolution(s)"]) {
            res.send(poke["Previous evolution(s)"].slice(-1));
          } else res.send([]);
        }
      });
    } else {
      const pokeId = Number(value);
      pokeData.pokemon.forEach((poke) => {
        if (Number(poke.id) === pokeId) {
          found = true;
          if (poke["Previous evolution(s)"]) {
            res.send(poke["Previous evolution(s)"].slice(-1));
          } else res.send([]);
        }
      });
    }
    if (!found) res.sendStatus(404);
  });

  ///////////////////////////////////////////////////
  ////////TYPES TYPES/////////////////////////
  //////////////////////////////////////

  app.get("/api/types", (req, res) => {
    if (req.query.n) {
      const limit = Number(req.query.n);
      if (limit < 1 || isNaN(limit)) {
        res.sendStatus(406);
      } else if (limit <= pokeData.types.length) {
        res.send(pokeData.types.slice(0, limit));
      }
    } else res.send(pokeData.types);
  });

  app.get("/api/types/:type/pokemon", (req, res) => {
    const result = [];
    if (pokeData.types.includes(req.params.type)) {
      pokeData.pokemon.forEach((poke) => {
        if (poke.types.includes(req.params.type)) {
          result.push({ id: poke.id, name: poke.name });
        }
      });
      res.send(result);
    } else res.sendStatus(404);
  });

  app.post("/api/types", (req, res) => {
    const { body } = req;
    pokeData.types.push(body.types);
    res.sendStatus(200);
  });

  app.delete("/api/types/:type", (req, res) => {
    const removeMe = req.params.type;
    const index = pokeData.types.indexOf(removeMe);
    if (index === -1) res.sendStatus(404);
    else {
      pokeData.types.splice(index, 1);
      res.sendStatus(200);
    }
  });

  /////////////////////////////////////////////////////
  ////////ATTACKS ATTACKS/////////////////////////
  //////////////////////////////////////

  app.get("/api/attacks", (req, res) => {
    const allatk = pokeData.attacks.fast.concat(pokeData.attacks.special);
    if (req.query.n) {
      const limit = Number(req.query.n);
      if (limit < 1 || isNaN(limit)) {
        res.sendStatus(406);
      } else if (limit <= allatk.length) {
        res.send(allatk.slice(0, limit));
      }
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

  app.post("/api/attacks/fast", (req, res) => {
    const { body } = req;
    pokeData.attacks.fast.push(body);
    res.sendStatus(200);
  });

  app.post("/api/attacks/special", (req, res) => {
    const { body } = req;
    pokeData.attacks.special.push(body);
    res.sendStatus(200);
  });

  app.patch("/api/attacks/:atkname", (req, res) => {
    const { atkname } = req.params;
    const { body } = req;
    let patched = false;
    function update(attack, updateObj) {
      for (const key of Object.keys(updateObj)) {
        attack[key] = updateObj[key];
        patched = true;
      }
    }
    pokeData.attacks.fast.forEach((atk) => {
      if (atk.name === atkname) update(atk, body);
    });
    pokeData.attacks.special.forEach((atk) => {
      if (atk.name === atkname) update(atk, body);
    });
    patched ? res.sendStatus(200) : res.sendStatus(404);
  });

  app.delete("/api/attacks/:atkname", (req, res) => {
    const { atkname } = req.params;
    let deleted = false;
    pokeData.attacks.fast.forEach((atk) => {
      if (atk.name === atkname) {
        const index = pokeData.attacks.fast.indexOf(atk);
        pokeData.attacks.fast.splice(index, 1);
        deleted = true;
      }
    });
    pokeData.attacks.special.forEach((atk) => {
      if (atk.name === atkname) {
        const index = pokeData.attacks.special.indexOf(atk);
        pokeData.attacks.special.splice(index, 1);
        deleted = true;
      }
    });
    deleted ? res.sendStatus(200) : res.sendStatus(404);
  });

  return app;
};

module.exports = { setupServer };
