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
