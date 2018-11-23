const request = require('supertest');
const app = require('../../app.js');
const dbHelper = require('../db-helper.js');
const jwtHelper = require('../jwt-helper.js');

describe('POST: /posts', () => {
    let test_patient_jwt;
    let testPatient = {
        username: 'get-post-test-patient',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
    };
    let testPost = {
        title: 'make-post test post',
        body: 'this is a make post test'
    };

    let privateTestPost = {
        title: 'this is a private post',
        body: 'this is a private question',
        private: true
    };

    beforeAll(() => {
        return dbHelper
            .clearDB()
            .then(() => {
                return dbHelper.createUser(testPatient);
            })
            .then((user) => {
                return jwtHelper.getJwt(user);
            })
            .then((jwt) => {
                test_patient_jwt = jwt;
            })
            .catch((err) => {
                // oops db setup failed
                console.log('POST: /posts', err);
            });
    });

    it('should respond with status 401, errors: [UNAUTHORIZED] \n if the jwt is invalid', () => {
        let randomJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI\
            6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        return request(app)
            .post('/posts')
            .set('Authorization', `Bearer: ${randomJWT}`)
            .send(testPost)
            .then((res) => {
                expect(res.statusCode).toBe(401);
                expect(res.body).toHaveProperty('errors', ['UNAUTHORIZED']);
            });
    });

    it('should respond with status 200, with the post information \n and store post (with private default to false) in the DB if everything is valid', () => {
        expect(test_patient_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .post('/posts')
            .set('Authorization', `Bearer: ${test_patient_jwt}`)
            .send(testPost)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id');
                expect(res.body).toHaveProperty('title', testPost.title);
                expect(res.body).toHaveProperty('body', testPost.body);
                expect(res.body).toHaveProperty('userType', testPatient.userType);
                expect(res.body).toHaveProperty('comments', []);
                expect(res.body).toHaveProperty('private', false);
            })
            .then(() => {
                return dbHelper
                    .checkPostExist(testPost)
                    .then((post) => {
                        expect(post).toBeDefined();
                        expect(post).toHaveProperty('title', testPost.title);
                        expect(post).toHaveProperty('body', testPost.body);
                        expect(post).toHaveProperty('userType', testPatient.userType);
                        expect(post).toHaveProperty('private', false);
                    });
            });
    });

    it('should respond with status 200, with the post information \n and store post (with the specified private flag) in the DB if everything is valid', () => {
        expect(test_patient_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .post('/posts')
            .set('Authorization', `Bearer: ${test_patient_jwt}`)
            .send(privateTestPost)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id');
                expect(res.body).toHaveProperty('title', privateTestPost.title);
                expect(res.body).toHaveProperty('body', privateTestPost.body);
                expect(res.body).toHaveProperty('userType', testPatient.userType);
                expect(res.body).toHaveProperty('comments', []);
                expect(res.body).toHaveProperty('private', privateTestPost.private);
            })
            .then(() => {
                return dbHelper
                    .checkPostExist(privateTestPost)
                    .then((post) => {
                        expect(post).toBeDefined();
                        expect(post).toHaveProperty('title', privateTestPost.title);
                        expect(post).toHaveProperty('body', privateTestPost.body);
                        expect(post).toHaveProperty('userType', testPatient.userType);
                        expect(post).toHaveProperty('private', privateTestPost.private);
                    });
            });
    });
});
