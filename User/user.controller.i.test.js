const request = require('supertest');

const app = require('../index');
const dotenv = require('dotenv');

dotenv.config();
const MOCK_TOKEN = process.env.MOCK_TOKEN;

describe("Should test /users/avatar API", () => {

    describe("Should test  PATCH /users/avatar route", () => {

        it("Without token should return status code 401", async () => {
            const responce = await request(app).patch('users/avatar');

            expect(responce.statusCode).toBe(401);
        });

        it("Without incorrect token should return status code 401", async () => {
            const responce = await request(app).patch('users/avatar')
                .set('Authorization', `Bearer incorrect_token`);
            
            expect(responce.statusCode).toBe(401);
        });

        it("On success should return status code 200", async () => {
            const responce = await request(app).patch('users/avatar')
                .set('Authorization', `Bearer ${MOCK_TOKEN}`)
                .attach('avatar', '../assets/avatar.jpg');
            
            expect(responce.statusCode).toBe(200);
        });
    });
});

