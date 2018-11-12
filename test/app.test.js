// reference: http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require('supertest');
const app = require('../app.js');

describe('POST: /login', () => {
    it('should respond with status: 400, errors: [INVALID_USERNAME, INVALID_PASSWORD] \n if body is empty',
        () => {
            return request(app).post("/login").then((res) => {
                expect(res.statusCode).toBe(400);
                expect(res.body.errors).toContain('INVALID_USERNAME');
                expect(res.body.errors).toContain('INVALID_PASSWORD');
            });
    });
});

describe('POST: /signup', () => {
    it('should respond with status: 400, errors: [INVALID_ACCESS_CODE] \n if access code not in db',
        () => {
            let req = {
                body: {
                    username: "testuser1",
                    password: "password",
                    firstName: "bob",
                    lastName: "bob",
                    accessCode: "notreal0",
                }
            };
            return request(app).post("/signup").then((req, res) => {
                expect(res.statusCode).toBe(400);
                expect(res.body.errors).toContain('INVALID_ACCESS_CODE');
            });
    });
});
