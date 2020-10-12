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
    describe("GET", () => {
      it("should return a list of all pokemon", async () => {
        const { body } = await request.get("/api/pokemon");
        body.length.should.equal(151);
      });
      it("when given a query parameter, it should return a list of n pokemon", async () => {
        const { body } = await request.get("/api/pokemon").query({ n: 15 });
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
        body.should.deep.equal([{ id: 121, name: "Starmie" }]);
      });
      it("should return the previous evolution of a pokemon", async () => {
        const { body } = await request.get(
          "/api/pokemon/17/evolutions/previous"
        );
        body.should.deep.equal([{ id: 16, name: "Pidgey" }]);
      });
    });
    xdescribe("POST", () => {
      it("should return status 418", async () => {
        const res = await request.get("/teapot");
        res.should.have.status(418);
      });
    });
    xdescribe("PATCH", () => {
      it("should return status 418", async () => {
        const res = await request.get("/teapot");
        res.should.have.status(418);
      });
    });
    xdescribe("DELETE", () => {
      it("should return status 418", async () => {
        const res = await request.get("/teapot");
        res.should.have.status(418);
      });
    });
  });
  /*
    describe("attacks", () => {
      it("should return the text/html 'world'", async () => {
        const res = await request.get("/hello");
        res.should.be.html;
        res.text.should.equal("world");
      });
    });

    describe("types", () => {
      it("should return the text/html 'world'", async () => {
        const res = await request.get("/hello");
        res.should.be.html;
        res.text.should.equal("world");
      });
    });
*/

  describe("types", () => {
    it("should return a list of types", async () => {
      const { body } = await request.get("/api/types");
      body.should.deep.equal(pokeData.types);
    });
    it("should return a list of all pokemon of a certain type", async () => {
      const { body } = await request.get("/api/types/Grass/pokemon");
      const res = [];
      pokeData.pokemon.forEach((poke) => {
        if (poke.types.includes("Grass")) {
          res.push({ id: poke.id, name: poke.name });
        }
      });
      body.should.deep.equal(res);
    });
  });
});
