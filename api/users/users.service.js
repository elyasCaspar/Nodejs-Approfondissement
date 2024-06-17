const User = require("./users.model");
const bcrypt = require("bcrypt");

class UserService {
  async getAll() {
    return await User.find({}, "-password");
  }
  async get(id) {
    return await User.findById(id, "-password");
  }
  async create(data) {
    const user = await new User(data);
    return await user.save();
  }
  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return await User.deleteOne({ _id: id });
  }
  async checkPasswordUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return false;
    }
    const bool = await bcrypt.compare(password, user.password);
    if (!bool) {
      return false;
    }
    return user._id;
  }
}

module.exports = new UserService();
