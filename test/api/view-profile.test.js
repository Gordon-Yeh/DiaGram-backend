// reference: http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require('supertest');
const app = require('../../app.js');
const dbHelper = require('../db-helper.js');
const jwtHelper = require('../jwt-helper.js');

describe('GET: /users/:user_id', () => {
    let test_patient_jwt_1;
    let test_patient_jwt_2;
    let test_doctor_jwt;
    let testPatient1 = {
        username: 'edit-profile-test-patient-1',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
        medications: 'testPatient1 medications',
        recentProcedures: 'testPatient1 recentProcedures',
        conditions: 'testPatient1 conditions'
    };
    let testPatient2 = {
        username: 'edit-profile-test-patient-2',
        password: 'test-password',
        firstName: 'Joe',
        lastName: 'Robson',
        userType: 'patient',
        medications: 'testPatient2 medications',
        recentProcedures: 'testPatient2 recentProcedures',
        conditions: 'testPatient2 conditions'
    };
    let testDoctor = {
        username: 'edit-profile-test-doctor',
        password: 'test-password',
        firstName: 'Steven',
        lastName: 'Phil',
        userType: 'doctor',
        experience: 'testDoctor experience',
        department: 'testDoctor department',
        specializations: 'testDoctor specializations'
    };

    beforeAll(() => {
        return dbHelper
            .clearDB()
            .then(() => {
                return Promise.all([
                    dbHelper.createUser(testPatient1),
                    dbHelper.createUser(testPatient2),
                    dbHelper.createUser(testDoctor)
                ]);
            })
            .then((users) => {
                testPatient1 = users[0];
                testPatient2 = users[1];
                testDoctor = users[2];
                return Promise
                    .all([
                        jwtHelper.getJwt(testPatient1),
                        jwtHelper.getJwt(testPatient2),
                        jwtHelper.getJwt(testDoctor)
                    ])
                    .then((jwts) => {
                        test_patient_jwt_1 = jwts[0];
                        test_patient_jwt_2 = jwts[1];
                        test_doctor_jwt = jwts[2];
                    });
            })
            .catch((err) => {
                // oops db setup failed
                console.log('PUT: /users', err);
            });
    });

    it('A doctor should be able to view the full content of a user profile', () => {
        return request(app)
            .get(`/users/${testPatient1._id}`)
            .set('Authorization', `Bearer: ${test_doctor_jwt}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', testPatient1._id.toString());
                expect(res.body).toHaveProperty('firstName', testPatient1.firstName);
                expect(res.body).toHaveProperty('lastName', testPatient1.lastName);
                expect(res.body).toHaveProperty('username', testPatient1.username);
                expect(res.body).toHaveProperty('medications', testPatient1.medications);
                expect(res.body).toHaveProperty('recentProcedures', testPatient1.recentProcedures);
                expect(res.body).toHaveProperty('conditions', testPatient1.conditions);
            });
    });

    it('A patient should be able to view the full content of a doctor profile', () => {
        return request(app)
            .get(`/users/${testDoctor._id}`)
            .set('Authorization', `Bearer: ${test_patient_jwt_1}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', testDoctor._id.toString());
                expect(res.body).toHaveProperty('firstName', testDoctor.firstName);
                expect(res.body).toHaveProperty('lastName', testDoctor.lastName);
                expect(res.body).toHaveProperty('username', testDoctor.username);
                expect(res.body).toHaveProperty('experience', testDoctor.experience);
                expect(res.body).toHaveProperty('recentProcedures', testDoctor.recentProcedures);
                expect(res.body).toHaveProperty('conditions', testDoctor.conditions);
            })
            .then(() => {
                return request(app)
                .get(`/users/${testDoctor._id}`)
                .set('Authorization', `Bearer: ${test_patient_jwt_2}`)
                .send()
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toHaveProperty('_id', testDoctor._id.toString());
                    expect(res.body).toHaveProperty('firstName', testDoctor.firstName);
                    expect(res.body).toHaveProperty('lastName', testDoctor.lastName);
                    expect(res.body).toHaveProperty('username', testDoctor.username);
                    expect(res.body).toHaveProperty('experience', testDoctor.experience);
                    expect(res.body).toHaveProperty('recentProcedures', testDoctor.recentProcedures);
                    expect(res.body).toHaveProperty('conditions', testDoctor.conditions);
                })
            });
    });

    it('A patient should be able to view the limited content of another patient profile', () => {
        return request(app)
            .get(`/users/${testPatient2._id}`)
            .set('Authorization', `Bearer: ${test_patient_jwt_1}`)
            .send()
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', testPatient2._id.toString());
                expect(res.body).not.toHaveProperty('firstName');
                expect(res.body).not.toHaveProperty('lastName');
                expect(res.body).not.toHaveProperty('username');
                expect(res.body).toHaveProperty('medications', testPatient2.medications);
                expect(res.body).toHaveProperty('recentProcedures', testPatient2.recentProcedures);
                expect(res.body).toHaveProperty('conditions', testPatient2.conditions);
            })
            .then(() => {
                return request(app)
                .get(`/users/${testPatient1._id}`)
                .set('Authorization', `Bearer: ${test_patient_jwt_2}`)
                .send()
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toHaveProperty('_id', testPatient1._id.toString());
                    expect(res.body).not.toHaveProperty('firstName');
                    expect(res.body).not.toHaveProperty('lastName');
                    expect(res.body).not.toHaveProperty('username');
                    expect(res.body).toHaveProperty('medications', testPatient1.medications);
                    expect(res.body).toHaveProperty('recentProcedures', testPatient1.recentProcedures);
                    expect(res.body).toHaveProperty('conditions', testPatient1.conditions);
                })
            });
    });

});
