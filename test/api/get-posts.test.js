const request = require('supertest');
const dbHelper = require('../db-helper.js');
const jwtHelper = require('../jwt-helper.js');
const app = require('../../app.js');

describe('GET: /posts', () => {
    const ROUTE = '/posts';
    let test_patient0_jwt;
    let test_patient1_jwt;
    let testPatient0 = {
        username: 'getPostTestPatient0',
        password: 'testPassword',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
    };
    let testPatient1 = {
        username: 'getPostTestPatient1',
        password: 'testPassword',
        firstName: 'Bob',
        lastName: 'Dylan',
        userType: 'patient',
    };
    let testComment = {
        body: 'this is an add comment test'
    };
    let testPosts = [];

    beforeAll(() => {
        return dbHelper
            .clearDB()
            .then(() => {
                return Promise.all([
                    dbHelper.createUser(testPatient0),
                    dbHelper.createUser(testPatient1)
                ]);
            })
            .then((users) => {
                testPatient0 = users[0];
                testPatient1 = users[1];

                return Promise
                    .all([
                        jwtHelper.getJwt(users[0]),
                        jwtHelper.getJwt(users[1]),
                    ])
                    .then((jwts) => {
                        test_patient0_jwt = jwts[0];
                        test_patient1_jwt = jwts[1];
                    });
            })
            .then(() => {
                return Promise
                    .all([
                        dbHelper.createPost(testPatient0, {
                            title: 'get-post test post',
                            body: 'this is a get post test'
                        }),
                        dbHelper.createPost(testPatient1, {
                            title: 'get-post test post',
                            body: 'this is a get post test'
                        })
                    ])
                    .then((posts) => {
                        testPosts = posts;
                    })
            })
            .catch((err) => {
                console.log(err);
                // oops db setup failed
            });
    });

    it('should respond with status 200 and all current posts', () => {
        expect(test_patient0_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .get('/posts')
            .set('Authorization', `Bearer: ${test_patient0_jwt}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveLength(2);
            });
    });

    it('should respond with status 200 and all followed posts', () => {
        expect(test_patient1_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .get('/posts/followed')
            .set('Authorization', `Bearer: ${test_patient1_jwt}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveLength(1);
            });
    });
});
