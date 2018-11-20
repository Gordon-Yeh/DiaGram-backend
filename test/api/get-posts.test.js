const request = require('supertest');
const AccessCode = require('../../models/AccessCode.js');
const User = require('../../models/User.js');
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
        accessCode: 'test-patient0-access-code'
    };
    let testPatient1 = {
        username: 'get-post-test-patient1',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Dylan',
        userType: 'patient',
        accessCode: 'test-patient1-access-code'
    };
    let testDoctor = {
        username: 'get-post-test-doctor',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Dylan',
        userType: 'doctor',
        accessCode: 'test-doctor-access-code'
    };
    let testComment = {
        body: 'this is an add comment test'
    };
    let testPosts = [];

    beforeAll(() => {
        return Promise.all([
                createUser(testPatient0),
                createUser(testPatient1),
                createUser(testDoctor),
                //deletePost(testPost[0]) // just in case the test post wasn't deleted from last execution
            ])
            .then((results) => {
                test_patient0_jwt = results[0].jwt;
                test_patient1_jwt = results[1].jwt;
                test_doctor_jwt = results[2].jwt;
                for(let i = 0; i < 2; i++) {
                    createPost(results[i].jwt, {
                        title: 'get-post test post',
                        body: 'this is a get post test'
                    })
                    .then((post) => {
                        console.log(`TEST POST ID ${i}: ${post}`);
                        testPosts[i] = post;
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                }
            })
            .catch((err) => {
                console.log(err);
                // oops db setup failed
            });
    });

    afterAll(() => {
        return Promise.all([
            deleteUser(testPatient0),
            deleteUser(testPatient1),
            deleteUser(testDoctor),
            deletePost(testPosts[0])
        ]);
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
                return checkUser(testDoctor)
                    .then((user) => {
                        expect(user.following).toContain(testPosts[0]._id);
                    });
            });
    });

    it('should respond with status 200 and user\'s followed posts', () => {
        expect(test_patient0_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .get('/posts')
            .set('Authorization', `Bearer: ${test_patient0_jwt}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveLength(1);

            });
    });

    it('should respond with status 200 and all current posts', () => {
        expect(test_patient0_jwt).toMatch(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);

        return request(app)
            .get('/posts/followed')
            .set('Authorization', `Bearer: ${test_patient0_jwt}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveLength(2);
            });
    });
});

const generateTestPosts = (numOfPosts) => {
    let posts = [];

    for (i = 0; i < numOfPosts; i++) {
        posts.push({
            title: i.toString(),
            body: i.toString()
        });
    };

    return posts;
}

const createPost = (post, jwt) => {
    return request(app)
        .post('/posts')
        .set('Authorization', `Bearer: ${jwt}`)
        .send(post);
}

const deletePost = (post) => {
    return Post.model.deleteMany(post);
};

const deleteUser = (user) => {
    return User.model.deleteMany({ username: user.username });
};

const createUser = (user) => {
    let testAccessCode = {
        accessCode: 'get-post-test-access-code',
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
