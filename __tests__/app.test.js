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
                expect(body.article).toEqual(
                    expect.objectContaining({
                    article_id: 2,
                    title: 'Sony Vaio; or, The Laptop',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 0
                    })
                )
            })
        });
        test('Status: 200, responds with the specified article with the new column comment_count', () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    comment_count: '11'
                })
            })
        })
    })
    describe('/api/users', () => {
        test('Status: 200, responds with an array of users', () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then((res) => {
                expect(res.body.users).toHaveLength(4);
                res.body.users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    )
                })
            })        
        })
    });
    describe('/api/articles', () => {
        test('Status: 200, responds with an array of articles ordered by descending date', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy("created_at", { descending: true})
            })
        });
    });
});

describe('PATCH', () => {
    describe('/api/articles/:article_id', () => {
        test('status: 200, responds with updated object', () => {
            const updateArticle = { votes: 100 }
            const expected = {
                article: {
                    article_id: 2,
                    title: 'Sony Vaio; or, The Laptop',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 100
                }
            }
            return request (app)
                .patch("/api/articles/2")
                .send(updateArticle)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual(expected)
            })
        })
    });
})

describe('ERROR', () => {
    describe('GET', () => {
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
            test('status: 400, returns "Bad request" - id input NAN', () => {
                return request(app)
                .get("/api/articles/article")
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual( { msg: "Bad request"})
                })
            })
            test('status: 404, returns message when no resource found', () => {
                return request(app)
                .get("/api/articles/9999999")
                .expect(404)
                .then((res) => {
                    expect(res.body).toEqual({msg: "No article found for article_id: 9999999"})
                })
            })
        })
    describe('PATCH', () => {
        describe('patchArticle', () => {
            test('status: 400, returns an empty object - malformed body', () => {
                return request(app)
                .patch("/api/articles/2")
                .send({})
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({msg: "Missing required fields"})
                    })
                });
            test('status: 400, returns message "Bad request" - incorrect type', () => {
                const updateArticle = {votes: 'one hundred'}
                return request(app)
                .patch("/api/articles/2")
                .send(updateArticle)
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual( {msg: 'Bad request'})
                    })
                });
            })
        });
    })
})