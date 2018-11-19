const request = require('supertest');
const AccessCode = require('../../models/AccessCode.js');
const User = require('../../models/User.js');
const Post = require('../../models/Post.js');
const app = require('../../app.js');

describe('POST: /posts', () => {
    let test_patient_jwt;
    let test_doctor_jwt;
    let test_post_id;
    let testPatient = {
        username: 'get-post-test-patient',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
        accessCode: 'test-patient-access-code'
    };
    let testDoctor = {
        username: 'get-post-test-doctor',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Dylan',
        userType: 'doctor',
        accessCode: 'test-doctor-access-code'
    };
    let testPost = {
        title: 'make-post test post',
        body: 'this is a make post test'
    }
    let testComment = {
        body: 'this is an add comment test'
    }

    beforeAll(() => {
        return Promise.all([
                createUser(testPatient),
                createUser(testDoctor),
                deletePost(testPost) // just in case the test post wasn't deleted from last execution
            ])
            .then((results) => {
                test_patient_jwt = results[0];
                test_doctor_jwt = results[1];
            })
            .catch((err) => {
                console.log(err);
                // oops db setup failed
            });
    });

    afterAll(() => {
        return Promise.all([
            deleteUser(testPatient),
            deleteUser(testDoctor),
            deletePost(testPost)
        ]);
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

    it('should respond with status 200, with the post information \n and store post in the DB if everything is valid', () => {
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
                expect(res.body).toHaveProperty('private');
                test_post_id = res.body._id;
            })
            .then(() => {
                return dbCheckPostExist(testPost)
                    .then((post) => {
                        expect(post).toBeDefined();
                    });
            });
    });

    it('should respond with status 200 with the updated post information, \n store comment in the post, and update the doctor\'s \n followed posts if everything is valid', () => {
        expect(test_doctor_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .post(`/posts/${test_post_id}/comments`)
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
                return checkUser(testDoctor)
                    .then((user) => {
                        expect(user.following).toContain(test_post_id);
                    });
            });
    });
});

const deletePost = (post) => {
    return Post.model.deleteMany(post);
};

const dbCheckPostExist = (post) => {
    return Post.model.findOne(post);
};

const deleteUser = (user) => {
    return User.model.deleteMany({ username: user.username });
};

const checkUser = (user) => {
    return User.model.findOne({ username: user.username });
};

const createUser = (user) => {
    let testAccessCode = {
        accessCode: user.accessCode,
        userType: user.userType
    };

    return AccessCode
        .create(testAccessCode)
        .catch((err) => {
            // failing at this point mostly like mean the access code wasn't consumed from last test
            // which doesn't effect our test, ignore error
            // return this because the next promise link is dependent of a result
            return testAccessCode;
        })
        .then((result) => {
            return request(app)
                .post('/signup')
                .send({
                    ...user,
                    accessCode: result.accessCode
                })
                .then((res) => {
                    return res.body.jwt;
                });
        });
};
