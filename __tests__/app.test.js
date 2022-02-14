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
    describe('/api/articles/:article_id', () => {
        test('Status: 200, responds with the specified article', () => {
            return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 2,
                    title: 'Sony Vaio; or, The Laptop',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 0
                })
            })
        });
    })
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
    describe('getArticleByID', () => {
        test('status: 400, returns when a bad request is made', () => {
            return request(app)
            .get("/api/articles/article")
            .expect(400)
            .then((res) => {
                expect(res.body).toEqual( { msg: "Bad request"})
            })
        })
        test('status: 404, returns when an invalid id is input', () => {
            return request(app)
            .get("/api/articles/9999999")
            .expect(404)
            .then((res) => {
                console.log(res)
                expect(res.body).toEqual({msg: "No article found for article_id: 9999999"})
            })
        })
    })
})