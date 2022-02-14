const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));

describe('GET', () => {
    describe('/api/topics', () => {
        test('status: 200, responds with an array of topics', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((res) => {
                console.log(res.body)
                expect(res.body.topics).toHaveLength(3);
                res.body.topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    )
                })
            })
        });
    });
});

describe('Errors', () => {
    describe('getTopics', () => {
        test('status: 404, returns invalid path string', () => {
            return request(app)
            .get("/api/invalidPath")
            .expect(404)
            .then((res) => {
                expect(res.body).toEqual({ msg: "Path not found"})
            })
        })
    })
})