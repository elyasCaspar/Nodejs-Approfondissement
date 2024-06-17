const NotFoundError = require("../errors/not-found");
const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const userService = require("../api/users/users.service");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    const user = await userService.get(decoded.userId);
    if (!user) {
      throw new NotFoundError();
    }
    req.user = user;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
