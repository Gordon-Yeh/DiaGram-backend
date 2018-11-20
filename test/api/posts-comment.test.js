const request = require('supertest');
const dbHelper = require('../db-helper.js');
const jwtHelper = require('../jwt-helper.js');
const app = require('../../app.js');

describe('GET: /posts', () => {
    const ROUTE = '/posts';
    let test_patient0_jwt;
    let test_patient1_jwt;
    let test_doctor_jwt;
    let testPatient0 = {
        username: 'get-post-test-patient0',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
    };
    let testPatient1 = {
        username: 'get-post-test-patient1',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Dylan',
        userType: 'patient',
    };
    let testDoctor = {
        username: 'get-post-test-doctor',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Dylan',
        userType: 'doctor',
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
                    dbHelper.createUser(testPatient1),
                    dbHelper.createUser(testDoctor)
                ]);
            }) 
            .then((users) => {
                testPatient0 = users[0];
                testPatient1 = users[1];
                testDoctor = users[2];

                return Promise
                    .all([
                        jwtHelper.getJwt(users[0]),
                        jwtHelper.getJwt(users[1]),
                        jwtHelper.getJwt(users[2])
                    ])
                    .then((jwts) => {
                        test_patient0_jwt = jwts[0];
                        test_patient1_jwt = jwts[1];
                        test_doctor_jwt = jwts[2];
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

    it('should respond with status 200 with the updated post information, \n store comment in the post, and update the doctor\'s \n followed posts if everything is valid', () => {
        expect(test_doctor_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .post(`/posts/${testPosts[0]._id}/comments`)
            .set('Authorization', `Bearer: ${test_doctor_jwt}`)
            .send(testComment)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id');
                expect(res.body.comments[0]).toHaveProperty('_id');
                expect(res.body.comments[0]).toHaveProperty('body', testComment.body);
                //expect(res.body.comments[0]).toHaveProperty('userId', testDoctor._id);
                expect(res.body.comments[0]).toHaveProperty('userType', testDoctor.userType);
                expect(res.body.comments[0]).toHaveProperty('createdAt');
            })
            //check that user's followed posts list was updated
            .then(() => {
                return dbHelper
                    .checkUser(testDoctor)
                    .then((user) => {
                        expect(user.following).toContain(testPosts[0]._id);
                    });
            });
    });
});
