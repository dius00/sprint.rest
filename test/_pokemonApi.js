const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
chai.should();

const pokeData = require("../src/data");

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = setupServer();
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });
  describe("pokemon", () => {
    describe("POST", () => {
      it("should add a pokemon to the list of pokemon", async () => {
        const addPoke = {
          id: "200",
          name: "Weird",
        };
        await request.post("/api/pokemon").send(addPoke);
        pokeData.pokemon[151].should.deep.equal(addPoke);
      });
      describe("PATCH", () => {
        it("should update a pokemon object", async () => {
          const addPoke = {
            id: "205",
          };
          await request.patch("/api/pokemon/200/").send(addPoke);
          pokeData.pokemon[151].id.should.equal("205");
        });
      });
      describe("DELETE", () => {
        it("should DELETE a pokemon object", async () => {
          await request.delete("/api/pokemon/205/");
          pokeData.pokemon.length.should.equal(151);
        });
      });
      describe("GET", () => {
        it("should return a list of all pokemon", async () => {
          const { body } = await request.get("/api/pokemon");
          body.length.should.equal(151);
        });
        it("when given a query parameter, it should return a list of n pokemon", async () => {
          const { body } = await request.get("/api/pokemon").query({
            n: 15,
          });
          body.length.should.equal(15);
        });
        it("should return the desired pokemon when the proper id is given as a parameter", async () => {
          const { body } = await request.get("/api/pokemon/1");
          body.name.should.equal("Bulbasaur");
        });
        it("should return the desired pokemon when the proper name is given as a parameter", async () => {
          const { body } = await request.get("/api/pokemon/Mew");
          body.name.should.equal("Mew");
        });

        it("should return all the evolutions for a pokemon", async () => {
          const { body } = await request.get("/api/pokemon/staryu/evolutions");
          body.should.deep.equal([
            {
              id: 121,
              name: "Starmie",
            },
          ]);
        });
        it("should return the previous evolution of a pokemon", async () => {
          const { body } = await request.get(
            "/api/pokemon/17/evolutions/previous"
          );
          body.should.deep.equal([
            {
              id: 16,
              name: "Pidgey",
            },
          ]);
        });
      });
    });
  });

  describe("types", () => {
    describe("POST", () => {
      it("should add a new Type to the list of Types", async () => {
        const addType = { types: "Onigiri" };
        await request.post("/api/types").send(addType);
        const bool = pokeData.types.includes(addType.types);
        bool.should.be.equal(true);
      });
    });
    describe("DELETE", () => {
      it("should DELETE a type from the list of Types", async () => {
        await request.delete("/api/types/Onigiri");
        const bool = pokeData.types.includes("Onigiri");
        bool.should.be.equal(false);
      });
    });
    describe("GET", () => {
      it("should return a list of types", async () => {
        const { body } = await request.get("/api/types");
        body.should.deep.equal(pokeData.types);
      });

      it("should return a list of all pokemon of a certain type", async () => {
        const { body } = await request.get("/api/types/Grass/pokemon");
        const res = [];
        pokeData.pokemon.forEach((poke) => {
          if (poke.types.includes("Grass")) {
            res.push({
              id: poke.id,
              name: poke.name,
            });
          }
        });
        body.should.deep.equal(res);
      });
    });
  });

  describe("attacks", () => {
    describe("POST", () => {
      it("should add a new attack to fast attacks", async () => {
        const attack = {
          name: "Chrysalize",
          type: "Bug",
          damage: 15,
        };
        await request.post("/api/attacks/fast").send(attack);
        const lastItem = pokeData.attacks.fast.slice(-1)[0];
        lastItem.should.deep.equal(attack);
      });
      it("should add a new attack to special attacks", async () => {
        const attack = {
          name: "JS-Error",
          type: "Unhandeld Exception",
          damage: 999,
        };
        await request.post("/api/attacks/special").send(attack);
        const lastItem = pokeData.attacks.special.slice(-1)[0];
        lastItem.should.deep.equal(attack);
      });
    });
    describe("PATCH", () => {
      it("should update an attack (fast)", async () => {
        const updateAttack = {
          damage: 205,
        };
        await request.patch("/api/attacks/Chrysalize").send(updateAttack);
        const lastItem = pokeData.attacks.fast.slice(-1)[0];
        lastItem.damage.should.equal(205);
      });
      it("should update an attack (special)", async () => {
        const updateAttack = {
          damage: 1,
        };
        await request.patch("/api/attacks/JS-Error/").send(updateAttack);
        const lastItem = pokeData.attacks.special.slice(-1)[0];
        lastItem.damage.should.equal(1);
      });
    });

    describe("DELETE", () => {
      it("should DELETE an attack from the list (fast)", async () => {
        await request.delete("/api/attacks/Chrysalize");
        let bool = null;
        pokeData.attacks.fast.forEach((atk) => {
          if (atk.name === "Chrysalize") bool = true;
        });
        if (bool === null) bool = false;
        bool.should.be.equal(false);
      });

      it("should DELETE an attack from the list (special)", async () => {
        await request.delete("/api/attacks/JS-Error");
        let bool = null;
        pokeData.attacks.special.forEach((atk) => {
          if (atk.name === "JS-Error") bool = true;
        });
        if (bool === null) bool = false;
        bool.should.be.equal(false);
      });
    });
    describe("GET", () => {
      it("should return a list of all attacks", async () => {
        const { body } = await request.get("/api/attacks");
        body.should.deep.equal(pokeData.attacks);
      });

      it("should return A list of all attacks if an an value is given", async () => {
        const { body } = await request.get("/api/attacks").query({
          n: 15,
        });
        body.length.should.equal(15);
      });

      it("should return a list of all fast attacks", async () => {
        const { body } = await request.get("/api/attacks/fast");
        body.should.deep.equal(pokeData.attacks.fast);
      });

      it("should return a list of n fast attacks", async () => {
        const { body } = await request.get("/api/attacks/fast").query({
          n: 15,
        });
        body.length.should.equal(15);
      });

      it("should return a list of all special attacks", async () => {
        const { body } = await request.get("/api/attacks/special");
        body.should.deep.equal(pokeData.attacks.special);
      });

      it("should return a list of n special attacks", async () => {
        const { body } = await request.get("/api/attacks/special").query({
          n: 15,
        });
        body.length.should.equal(15);
      });

      it("should Get a specific attack by name, no matter if it is fast or special", async () => {
        const { body } = await request.get("/api/attacks/Earthquake");
        const attack = {
          name: "Earthquake",
          type: "Ground",
          damage: 100,
        };
        body.should.deep.equal(attack);
      });

      it("should return a list of all pokemon that have a certain attack", async () => {
        const { body } = await request.get("/api/attacks/Earthquake/pokemon");
        const result = [];
        const all = pokeData.pokemon;
        for (const poke of all) {
          for (const fast of poke.attacks.fast) {
            if (fast.name === "Earthquake") {
              result.push({
                id: poke.id,
                name: poke.name,
              });
            }
          }
          for (const special of poke.attacks.special) {
            if (special.name === "Earthquake") {
              result.push({
                id: poke.id,
                name: poke.name,
              });
            }
          }
        }
        body.should.deep.equal(result);
      });
    });
  });
});
//});
