const request = require('supertest');
const mongoose = require('mongoose');
const AccessCode = require('../../models/AccessCode.js');
const User = require('../../models/User.js');
const app = require('../../app.js');

describe('POST: /signup', () => {
    let testAccessCode = {
        accessCode: 'signup_test_code',
        userType: 'patient',
    };

    let testUser = {
        username: "testuser1",
        password: "password",
        firstName: "Bob",
        lastName: "Ross"
    };

    beforeAll(() => {
        return AccessCode
            .create(testAccessCode)
            .catch((err) => {
                // if we hit this point this could mean:
                // 1) the access code already exist in DB because somehow the last test didnt consume
                // 2) DB connrection failed, we should stop the whole test at this point TODO:
            });
    });

    afterAll(() => {
        return User.model.findOneAndDelete({ username: testUser.username });
    });

    it('should respond with status: 400, errors: [INVALID_ACCESS_CODE] \n if access code not in db', () => {
        let body = {
            ...testUser,
            accessCode: "definitely-not-an-access-code",
        };

        return request(app)
            .post("/signup")
            .send(body)
            .then((res) => {
                expect(res.statusCode).toBe(400);
                expect(res.body.errors).toContain('INVALID_ACCESS_CODE');
            });
    });

    it('should response with status: 200, with the user object and a JWT \n if everything is valid', () => {
        // TODO: possibly use "jsonwebtoken" library to do this check
        const jwtRegex = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

        let body = {
            ...testUser,
            accessCode: testAccessCode.accessCode
        };

        return request(app)
            .post("/signup")
            .send(body)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('jwt');
                expect(res.body.jwt).toMatch(jwtRegex);

                expect(res.body).toHaveProperty('user');
                expect(res.body.user).toHaveProperty('_id');
                expect(res.body.user).toHaveProperty('username', testUser.username);
                expect(res.body.user).toHaveProperty('firstName', testUser.firstName);
                expect(res.body.user).toHaveProperty('lastName', testUser.lastName);
                expect(res.body.user).toHaveProperty('userType', testAccessCode.userType);
            });
    });
});
