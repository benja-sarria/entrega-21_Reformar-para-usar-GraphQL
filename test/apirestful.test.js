const { describe } = require("mocha");

const request = require("supertest")("http://localhost:8080");
const expect = require("chai").expect;


describe("test api",  () => {
    describe("GET", () => {
        let response = await request.get("/api");
        expect(response.status).to.eql(200)
    })
})