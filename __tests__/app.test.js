const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

describe("GET", () => {
  describe('/api', () => {
    test('Status: 200, responds with the JSON describing endpoints', () => {
      return request(app)
      .get("/api")
      .expect(200)

      })
  });
  describe("/api/topics", () => {
    test("status: 200, responds with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toHaveLength(3);
          res.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("Status: 200, responds with the specified article", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              author: "icellusedkars",
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
            })
          );
        });
    });
    test("Status: 200, responds with the specified article with the new column comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("11");
        });
    });
  });
  describe("/api/users", () => {
    test("Status: 200, responds with an array of users", () => {
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
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("/api/articles", () => {
    test("Status: 200, responds with an array of articles ordered by descending date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Status: 200, responds with the included comment_count column", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 200, should return the articles sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("Status: 200, should return the articles sorted by body ordered ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=body&order_by=ASC")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("body", { ascending: true });
        });
    });
    test("Status: 200, should return the articles where the topic is mitch", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
              })
            );
          });
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("Status: 200, responds with an array of comments for the selected article", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then((res) => {
          res.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 200, responds with an empty array", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });
  });
  describe("/api/users/:username", () => {
    test('Status: 200, returns the specified user', () => {
      return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({body}) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          })
        )
      })
    })
  })
});

describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    test("status: 200, responds with updated object", () => {
      const updateArticle = { votes: 100 };
      const expected = {
        article: {
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 100,
        },
      };
      return request(app)
        .patch("/api/articles/2")
        .send(updateArticle)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(expected);
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("Status: 201, returns the added object", () => {
      const newComment = {
        username: "butter_bridge",
        body: "What a wonderfully artistic vision",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              body: "What a wonderfully artistic vision",
              author: "butter_bridge",
              article_id: 1,
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
  });
});

describe("DELETE", () => {
    describe('/api/comments/:comment_id', () => {
        test('Status: 204', () => {
            return request(app)
            .delete("/api/comments/2")
            .expect(204)
        });
    });
  });

describe("ERRORS", () => {
  describe("GET", () => {
    describe("/api/topics", () => {
      test("status: 404, returns invalid path string", () => {
        return request(app)
          .get("/api/invalidPath")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Path not found" });
          });
      });
    });
    describe("/api/articles/:article_id", () => {
      test('status: 400, returns "Bad request" - id input NAN', () => {
        return request(app)
          .get("/api/articles/article")
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Bad request" });
          });
      });
      test("status: 404, returns message when no resource found", () => {
        return request(app)
          .get("/api/articles/9999999")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({
              msg: "Unable to find resource",
            });
          });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      test("Status: 404, returns message when no article found", () => {
        return request(app)
          .get("/api/articles/99999/comments")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({
              msg: "Unable to find resource",
            });
          });
      });
    });
    describe("/api/articles?query", () => {
      test("Status: 400, return bad request when invalid query input", () => {
        return request(app)
          .get("/api/articles?topic=gary")
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({
              msg: "Bad request",
            });
          });
      });
    });
    describe('/api/users/:username', () => {
      test('Status: 404, unable to find resource', () => {
        return request(app)
        .get("/api/users/butter")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual('Unable to find resource') 
        })
      });
    });
  });
  describe("PATCH", () => {
    describe("/api/articles/:article_id", () => {
      test("status: 400, returns an empty object - malformed body", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({})
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Missing required field" });
          });
      });
      test('status: 400, returns message "Bad request" - incorrect type', () => {
        const updateArticle = { votes: "one hundred" };
        return request(app)
          .patch("/api/articles/2")
          .send(updateArticle)
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Bad request" });
          });
      });
    });
  });
  describe("POST", () => {
    describe("/api/articles/:article_id/comments", () => {
      test("status: 404, article does not exist", () => {
        const newComment = {
          username: "butter_bridge",
          body: "What a wonderfully artistic vision",
        };
        return request(app)
          .post("/api/articles/999999/comments")
          .send(newComment)
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Unable to find resource" });
          });
      });
      test("Status: 400, bad request, missing required field", () => {
        const newComment = {};
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Bad request" });
          });
      });
      test("Status: 400, failed schema validation", () => {
        const newComment = {
          username: "butter_bridge",
          body: null,
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Bad request" });
          });
      });
    });
  });
  describe('DELETE', () => {
    describe('/api/comments/:comment_id', () => {
        test('Status: 404', () => {
            return request(app)
            .delete('/api/comments/999999')
            .expect(404)
            .then((res) => {
                expect(res.body).toEqual({
                    msg: "Unable to find resource"
                })
            })
        });
        test('Status: 400', () => {
          return request(app)
          .delete('/api/comments/invalid')
          .expect(400)
          .then((res) => {
              expect(res.body).toEqual({
                  msg: "Bad request"
              })
          })
      });
    });
  });
});
