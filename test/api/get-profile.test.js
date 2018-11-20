// reference: http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require('supertest');
const app = require('../../app.js');
const dbHelper = require('../db-helper.js');
const jwtHelper = require('../jwt-helper.js');

describe('GET: /users', () => {
    let test_patient_jwt;
    let testPatient = {
        username: 'get-post-test-patient',
        password: 'test-password',
        firstName: 'Bob',
        lastName: 'Ross',
        userType: 'patient',
    };
    let testPatientEdited = {
        firstName: 'Harold'
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
                console.log('GET: /users', err);
            });
    });

    it('should respond with status: 200, and return own profile', () => {
        return request(app)
            .get("/users")
            .set('Authorization', `Bearer: ${test_patient_jwt}`)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('firstName', testPatient.firstName);
                expect(res.body).toHaveProperty('lastName', testPatient.lastName);
                expect(res.body).toHaveProperty('username', testPatient.username);
            });
    });

    it('should respond with status: 200, and modify own profile', () => {
        return request(app)
            .put("/users")
            .set('Authorization', `Bearer: ${test_patient_jwt}`)
            .send(testPatientEdited)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('firstName', testPatientEdited.firstName);
                expect(res.body).toHaveProperty('lastName', testPatient.lastName);
                expect(res.body).toHaveProperty('username', testPatient.username);
            });
    });
});
