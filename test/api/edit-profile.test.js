// reference: http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require('supertest');
const app = require('../../app.js');
const dbHelper = require('../db-helper.js');
const jwtHelper = require('../jwt-helper.js');

describe('PUT: /users', () => {
    let test_patient_jwt;
    let test_doctor_jwt;
    let testPatient = {
        username: 'edit-profile-test-patient',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
    };
    let testDoctor = {
        username: 'edit-profile-test-doctor',
        password: 'test-password',
        firstName: 'Steven',
        lastName: 'Phil',
        userType: 'doctor',
    };

    beforeAll(() => {
        return dbHelper
            .clearDB()
            .then(() => {
                return Promise.all([
                    dbHelper.createUser(testPatient),
                    dbHelper.createUser(testDoctor)
                ]);
            })
            .then((users) => {
                testPatient = users[0];
                testDoctor = users[1];
                return Promise
                    .all([
                        jwtHelper.getJwt(testPatient),
                        jwtHelper.getJwt(testDoctor)
                    ])
                    .then((jwts) => {
                        test_patient_jwt = jwts[0];
                        test_doctor_jwt = jwts[1];
                    });
            })
            .catch((err) => {
                // oops db setup failed
                console.log('PUT: /users', err);
            });
    });

    it('should respond with status: 200, and modify own profile', () => {
        let edit = {
            firstName: 'Harold',
            lastName: 'Johnson',
            medications: 'test medications',
            recentProcedures: 'test procedures',
            conditions: 'test conditions',
        };
    
        return request(app)
            .put("/users")
            .set('Authorization', `Bearer: ${test_patient_jwt}`)
            .send(edit)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', testPatient._id.toString());
                expect(res.body).toHaveProperty('firstName', edit.firstName);
                expect(res.body).toHaveProperty('lastName', edit.lastName);
                expect(res.body).toHaveProperty('username', testPatient.username);
                expect(res.body).toHaveProperty('medications', edit.medications);
                expect(res.body).toHaveProperty('recentProcedures', edit.recentProcedures);
                expect(res.body).toHaveProperty('conditions', edit.conditions);
            });
    });

    it('should respond with status: 200, and modify doctor profile with the correct fields', () => {
        let edit = {
            experience: 'experience with testing',
            specializations: 'testing',
            department: 'department of testing'
        };

        return request(app)
            .put("/users")
            .set('Authorization', `Bearer: ${test_doctor_jwt}`)
            .send(edit)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', testDoctor._id.toString());
                expect(res.body).toHaveProperty('firstName', testDoctor.firstName);
                expect(res.body).toHaveProperty('lastName', testDoctor.lastName);
                expect(res.body).toHaveProperty('username', testDoctor.username);
                expect(res.body).toHaveProperty('experience', edit.experience);
                expect(res.body).toHaveProperty('specializations', edit.specializations);
                expect(res.body).toHaveProperty('department', edit.department);
            });
    });
});
