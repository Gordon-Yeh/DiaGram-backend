// reference: http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User.js');
const app = require('../app.js');

describe('POST: /login', () => {
    let testUser = {
        username: 'login_test_user',
        password: 'login_test_password',
        firstName: 'bob',
        lastName: 'flay',
        userType: 'patient'
    };

    beforeAll(() => {
        return User
            .create(testUser)
            .catch((err) => {
                // If we hit this point, then that means the testUser wasn't deleted properly last time
                // testUser already in DB just ignore this error
            });
    });

    afterAll(() => {
        return User.model.findOneAndDelete({ username: testUser.username });
    });
    
    
    it('should respond with status: 400, errors: [INVALID_USERNAME, INVALID_PASSWORD] \n if body is empty', () => {
        return request(app)
            .post("/login")
            .then((res) => {
                expect(res.statusCode).toBe(400);
                expect(res.body.errors).toContain('INVALID_USERNAME');
                expect(res.body.errors).toContain('INVALID_PASSWORD');
            });
    });

    it('should with status: 401, errors: [UNAUTHORIZED] \n if the user does not exist', () => {
        return request(app)
            .post("/login")
            .send({
                username: 'non-existent-user',
                password: 'password'
            })
            .then((res) => {
                expect(res.statusCode).toBe(401);
                expect(res.body.errors).toContain('UNAUTHORIZED');
            });
    });

    it('should with status: 401, errors: [UNAUTHORIZED] \n if the password is incorrect', () => {
        return request(app)
            .post("/login")
            .send({
                username: testUser.username,
                password: 'obviously the wrong password'
            })
            .then((res) => {
                expect(res.statusCode).toBe(401);
                expect(res.body.errors).toContain('UNAUTHORIZED');
            });
    });


    it('should response with status: 200, with the user object and a JWT \n if username and password are valid', () => {
        // TODO: possibly use "jsonwebtoken" library to do this check
        const jwtRegex = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

        return request(app)
            .post("/login")
            .send({
                username: testUser.username,
                password: testUser.password
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('jwt');
                expect(res.body.jwt).toMatch(jwtRegex);

                expect(res.body).toHaveProperty('user');
                expect(res.body.user).toHaveProperty('_id');
                expect(res.body.user).toHaveProperty('username', testUser.username);
                expect(res.body.user).toHaveProperty('firstName', testUser.firstName);
                expect(res.body.user).toHaveProperty('lastName', testUser.lastName);
                expect(res.body.user).toHaveProperty('userType', testUser.userType);
            });
    });
});
