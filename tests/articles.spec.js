const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const User = require("../api/users/users.model");

describe("Tester API Articles", () => {
  let token;
  const USER_ID = "fake";
  const ARTICLE_ID = "fake";
  const MOCK_USER = {
    _id: USER_ID,
    name: "test",
    email: "test@test.net",
    password: "azertyuiop",
    role: "admin",
  };
  const MOCK_DATA_CREATED = {
    title: "new",
    content: "",
    state: "draft",
  };
  const MOCK_DATA_UPDATED = {
    title: "edited",
    content: "",
    state: "published",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_USER, "findOne");
    mockingoose(Article).toReturn({ ...MOCK_DATA_CREATED, _id: ARTICLE_ID }, "save");
    mockingoose(Article).toReturn({ ...MOCK_DATA_UPDATED, _id: ARTICLE_ID }, "findOneAndUpdate");
    mockingoose(Article).toReturn({ _id: ARTICLE_ID }, "findOneAndRemove");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
