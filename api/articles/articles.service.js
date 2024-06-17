const Article = require("./articles.schema");

class ArticlesService {
  async create(data) {
    const article = new Article(data);
    return await article.save();
  }
  async update(id, data) {
    return await Article.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return await Article.deleteOne({ _id: id });
  }
  async getByUser(user) {
    return await Article.find().populate({
      path: "user",
      select: "-password",
      match: { name: user.name },
    });
  }
}

module.exports = new ArticlesService();
